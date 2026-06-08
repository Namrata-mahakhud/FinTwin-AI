import { logger } from '../config/logger';
import { config } from '../config/environment';

export interface AgentContext {
  scenarioId: string;
  portfolioId: string;
  simulationId: string;
  parameters: Record<string, unknown>;
}

export interface AgentResult {
  agentId: string;
  agentType: string;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  data: Record<string, unknown>;
  confidence: number;
  executionTime: number;
  error?: string;
}

export abstract class BaseAgent {
  protected agentId: string;
  protected agentType: string;
  protected timeout: number;
  protected maxRetries: number;

  constructor(agentType: string) {
    this.agentId = `${agentType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.agentType = agentType;
    this.timeout = config.agents.timeoutMs;
    this.maxRetries = config.agents.maxRetries;
  }

  /**
   * Execute the agent with retry logic
   */
  async execute(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        logger.info(`${this.agentType} executing (attempt ${attempt}/${this.maxRetries})`);

        // Execute with timeout
        const result = await this.executeWithTimeout(context);

        const executionTime = Date.now() - startTime;

        logger.info(`${this.agentType} completed successfully in ${executionTime}ms`);

        return {
          agentId: this.agentId,
          agentType: this.agentType,
          status: 'SUCCESS',
          data: result,
          confidence: this.calculateConfidence(result),
          executionTime,
        };
      } catch (error) {
        lastError = error as Error;
        logger.warn(`${this.agentType} attempt ${attempt} failed:`, error);

        if (attempt < this.maxRetries) {
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          await this.sleep(delay);
        }
      }
    }

    // All retries failed
    const executionTime = Date.now() - startTime;
    logger.error(`${this.agentType} failed after ${this.maxRetries} attempts`);

    return {
      agentId: this.agentId,
      agentType: this.agentType,
      status: 'FAILED',
      data: {},
      confidence: 0,
      executionTime,
      error: lastError?.message || 'Unknown error',
    };
  }

  /**
   * Execute agent logic with timeout
   */
  private async executeWithTimeout(context: AgentContext): Promise<Record<string, unknown>> {
    return Promise.race([this.process(context), this.timeoutPromise()]);
  }

  /**
   * Create a timeout promise
   */
  private timeoutPromise(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Agent execution timeout after ${this.timeout}ms`));
      }, this.timeout);
    });
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Abstract method to be implemented by specific agents
   */
  protected abstract process(context: AgentContext): Promise<Record<string, unknown>>;

  /**
   * Calculate confidence score based on result
   */
  protected abstract calculateConfidence(result: Record<string, unknown>): number;

  /**
   * Validate agent context
   */
  protected validateContext(context: AgentContext): void {
    if (!context.scenarioId) {
      throw new Error('scenarioId is required');
    }
    if (!context.portfolioId) {
      throw new Error('portfolioId is required');
    }
    if (!context.simulationId) {
      throw new Error('simulationId is required');
    }
  }
}

// Made with Bob
