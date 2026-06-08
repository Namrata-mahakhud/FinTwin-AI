// Journey Analytics Service - Track user journey events

export enum JourneyEvent {
  JOURNEY_STARTED = 'journey_started',
  JOURNEY_RESUMED = 'journey_resumed',
  JOURNEY_COMPLETED = 'journey_completed',
  JOURNEY_ABANDONED = 'journey_abandoned',
  JOURNEY_RESET = 'journey_reset',
  STAGE_ENTERED = 'stage_entered',
  STAGE_COMPLETED = 'stage_completed',
  STAGE_SKIPPED = 'stage_skipped',
  VALIDATION_FAILED = 'validation_failed',
  DATA_SAVED = 'data_saved',
  NAVIGATION_CLICKED = 'navigation_clicked',
}

interface JourneyEventData {
  journeyId: string;
  userId?: string;
  timestamp: string;
  event: JourneyEvent;
  stage?: string;
  metadata?: Record<string, any>;
}

interface JourneyMetrics {
  totalJourneys: number;
  completedJourneys: number;
  abandonedJourneys: number;
  averageCompletionTime: number;
  completionRate: number;
  stageDropOffRates: Record<string, number>;
  averageTimePerStage: Record<string, number>;
}

class JourneyAnalyticsService {
  private events: JourneyEventData[] = [];
  private sessionStartTime: number | null = null;
  private stageStartTimes: Map<string, number> = new Map();

  /**
   * Track a journey event
   */
  trackEvent(
    event: JourneyEvent,
    journeyId: string,
    stage?: string,
    metadata?: Record<string, any>
  ): void {
    const eventData: JourneyEventData = {
      journeyId,
      timestamp: new Date().toISOString(),
      event,
      stage,
      metadata,
    };

    this.events.push(eventData);
    
    // Store in localStorage for persistence
    this.persistEvent(eventData);
    
    // Send to analytics service (if configured)
    this.sendToAnalytics(eventData);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Journey Analytics]', eventData);
    }
  }

  /**
   * Track journey start
   */
  trackJourneyStart(journeyId: string, metadata?: Record<string, any>): void {
    this.sessionStartTime = Date.now();
    this.trackEvent(JourneyEvent.JOURNEY_STARTED, journeyId, undefined, {
      ...metadata,
      startTime: this.sessionStartTime,
    });
  }

  /**
   * Track journey resume
   */
  trackJourneyResume(journeyId: string, currentStage: string): void {
    this.trackEvent(JourneyEvent.JOURNEY_RESUMED, journeyId, currentStage, {
      resumeTime: Date.now(),
    });
  }

  /**
   * Track journey completion
   */
  trackJourneyComplete(journeyId: string, metadata?: Record<string, any>): void {
    const completionTime = this.sessionStartTime 
      ? Date.now() - this.sessionStartTime 
      : 0;
    
    this.trackEvent(JourneyEvent.JOURNEY_COMPLETED, journeyId, undefined, {
      ...metadata,
      completionTime,
      completionTimeMinutes: Math.round(completionTime / 60000),
    });
    
    this.sessionStartTime = null;
  }

  /**
   * Track journey abandonment
   */
  trackJourneyAbandon(journeyId: string, currentStage: string, reason?: string): void {
    const abandonTime = this.sessionStartTime 
      ? Date.now() - this.sessionStartTime 
      : 0;
    
    this.trackEvent(JourneyEvent.JOURNEY_ABANDONED, journeyId, currentStage, {
      reason,
      timeBeforeAbandon: abandonTime,
      timeBeforeAbandonMinutes: Math.round(abandonTime / 60000),
    });
  }

  /**
   * Track journey reset
   */
  trackJourneyReset(journeyId: string): void {
    this.trackEvent(JourneyEvent.JOURNEY_RESET, journeyId);
    this.sessionStartTime = null;
    this.stageStartTimes.clear();
  }

  /**
   * Track stage entry
   */
  trackStageEnter(journeyId: string, stage: string): void {
    this.stageStartTimes.set(stage, Date.now());
    this.trackEvent(JourneyEvent.STAGE_ENTERED, journeyId, stage, {
      enterTime: Date.now(),
    });
  }

  /**
   * Track stage completion
   */
  trackStageComplete(journeyId: string, stage: string, metadata?: Record<string, any>): void {
    const startTime = this.stageStartTimes.get(stage);
    const timeOnStage = startTime ? Date.now() - startTime : 0;
    
    this.trackEvent(JourneyEvent.STAGE_COMPLETED, journeyId, stage, {
      ...metadata,
      timeOnStage,
      timeOnStageSeconds: Math.round(timeOnStage / 1000),
    });
    
    this.stageStartTimes.delete(stage);
  }

  /**
   * Track validation failure
   */
  trackValidationFailed(
    journeyId: string,
    stage: string,
    validationErrors: string[]
  ): void {
    this.trackEvent(JourneyEvent.VALIDATION_FAILED, journeyId, stage, {
      errors: validationErrors,
      errorCount: validationErrors.length,
    });
  }

  /**
   * Track data save
   */
  trackDataSaved(journeyId: string, stage: string, dataKey: string): void {
    this.trackEvent(JourneyEvent.DATA_SAVED, journeyId, stage, {
      dataKey,
      savedAt: Date.now(),
    });
  }

  /**
   * Track navigation click
   */
  trackNavigationClick(
    journeyId: string,
    fromStage: string,
    toStage: string,
    direction: 'next' | 'previous' | 'jump'
  ): void {
    this.trackEvent(JourneyEvent.NAVIGATION_CLICKED, journeyId, fromStage, {
      toStage,
      direction,
    });
  }

  /**
   * Get journey metrics
   */
  getMetrics(): JourneyMetrics {
    const journeyIds = new Set(this.events.map(e => e.journeyId));
    const totalJourneys = journeyIds.size;
    
    const completedJourneys = this.events.filter(
      e => e.event === JourneyEvent.JOURNEY_COMPLETED
    ).length;
    
    const abandonedJourneys = this.events.filter(
      e => e.event === JourneyEvent.JOURNEY_ABANDONED
    ).length;
    
    const completionTimes = this.events
      .filter(e => e.event === JourneyEvent.JOURNEY_COMPLETED)
      .map(e => e.metadata?.completionTime || 0)
      .filter(t => t > 0);
    
    const averageCompletionTime = completionTimes.length > 0
      ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
      : 0;
    
    const completionRate = totalJourneys > 0
      ? (completedJourneys / totalJourneys) * 100
      : 0;
    
    // Calculate stage drop-off rates
    const stageDropOffRates: Record<string, number> = {};
    const stageEntries: Record<string, number> = {};
    const stageCompletions: Record<string, number> = {};
    
    this.events.forEach(event => {
      if (event.stage) {
        if (event.event === JourneyEvent.STAGE_ENTERED) {
          stageEntries[event.stage] = (stageEntries[event.stage] || 0) + 1;
        } else if (event.event === JourneyEvent.STAGE_COMPLETED) {
          stageCompletions[event.stage] = (stageCompletions[event.stage] || 0) + 1;
        }
      }
    });
    
    Object.keys(stageEntries).forEach(stage => {
      const entries = stageEntries[stage];
      const completions = stageCompletions[stage] || 0;
      stageDropOffRates[stage] = entries > 0 
        ? ((entries - completions) / entries) * 100 
        : 0;
    });
    
    // Calculate average time per stage
    const averageTimePerStage: Record<string, number> = {};
    const stageTimes: Record<string, number[]> = {};
    
    this.events
      .filter(e => e.event === JourneyEvent.STAGE_COMPLETED && e.metadata?.timeOnStage)
      .forEach(event => {
        if (event.stage) {
          if (!stageTimes[event.stage]) {
            stageTimes[event.stage] = [];
          }
          stageTimes[event.stage].push(event.metadata!.timeOnStage);
        }
      });
    
    Object.keys(stageTimes).forEach(stage => {
      const times = stageTimes[stage];
      averageTimePerStage[stage] = times.length > 0
        ? times.reduce((a, b) => a + b, 0) / times.length
        : 0;
    });
    
    return {
      totalJourneys,
      completedJourneys,
      abandonedJourneys,
      averageCompletionTime,
      completionRate,
      stageDropOffRates,
      averageTimePerStage,
    };
  }

  /**
   * Get all events
   */
  getEvents(): JourneyEventData[] {
    return [...this.events];
  }

  /**
   * Get events for a specific journey
   */
  getJourneyEvents(journeyId: string): JourneyEventData[] {
    return this.events.filter(e => e.journeyId === journeyId);
  }

  /**
   * Clear all events
   */
  clearEvents(): void {
    this.events = [];
    localStorage.removeItem('journey_analytics_events');
  }

  /**
   * Persist event to localStorage
   */
  private persistEvent(event: JourneyEventData): void {
    try {
      const stored = localStorage.getItem('journey_analytics_events');
      const events = stored ? JSON.parse(stored) : [];
      events.push(event);
      
      // Keep only last 1000 events
      if (events.length > 1000) {
        events.shift();
      }
      
      localStorage.setItem('journey_analytics_events', JSON.stringify(events));
    } catch (error) {
      console.error('Failed to persist analytics event:', error);
    }
  }

  /**
   * Send event to analytics service
   */
  private sendToAnalytics(event: JourneyEventData): void {
    // TODO: Implement actual analytics service integration
    // Examples: Google Analytics, Mixpanel, Amplitude, etc.
    
    // For now, just log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics Service]', event);
    }
    
    // Example implementation:
    // if (window.gtag) {
    //   window.gtag('event', event.event, {
    //     journey_id: event.journeyId,
    //     stage: event.stage,
    //     ...event.metadata,
    //   });
    // }
  }

  /**
   * Load persisted events
   */
  loadPersistedEvents(): void {
    try {
      const stored = localStorage.getItem('journey_analytics_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load persisted analytics events:', error);
    }
  }
}

// Export singleton instance
export const journeyAnalytics = new JourneyAnalyticsService();

// Load persisted events on initialization
journeyAnalytics.loadPersistedEvents();

// Made with Bob