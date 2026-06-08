/**
 * Scenario Repository
 */

import { Model, SortOrder } from 'mongoose';
import { ScenarioDocument, ScenarioFilters } from '../types/scenario.types';
import { MongoUtils } from '../utils/helpers.util';

export class ScenarioRepository {
  constructor(private model: Model<any>) {}

  async create(data: any): Promise<ScenarioDocument> {
    const document = new this.model(data);
    const saved = await document.save();
    return saved.toObject();
  }

  async findAll(
    filters: ScenarioFilters,
    page: number,
    limit: number,
    sort?: string
  ): Promise<ScenarioDocument[]> {
    const query = this.buildQuery(filters);
    const skip = (page - 1) * limit;
    const sortObj = MongoUtils.buildSort(sort) as Record<string, SortOrder>;

    return (await this.model
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortObj)
      .lean()
      .exec()) as unknown as ScenarioDocument[];
  }

  async findById(id: string): Promise<ScenarioDocument | null> {
    return (await this.model.findById(id).lean().exec()) as unknown as ScenarioDocument | null;
  }

  async findByIdAndUserId(id: string, userId: string): Promise<ScenarioDocument | null> {
    return (await this.model
      .findOne({ _id: id, createdBy: userId })
      .lean()
      .exec()) as unknown as ScenarioDocument | null;
  }

  async update(id: string, data: any): Promise<ScenarioDocument | null> {
    return (await this.model
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .lean()
      .exec()) as unknown as ScenarioDocument | null;
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }

  async count(filters: ScenarioFilters): Promise<number> {
    const query = this.buildQuery(filters);
    return await this.model.countDocuments(query).exec();
  }

  async addSimulation(scenarioId: string, simulationId: string): Promise<void> {
    await this.model
      .findByIdAndUpdate(scenarioId, {
        $push: { simulations: simulationId },
      })
      .exec();
  }

  async findByUserId(userId: string, page: number, limit: number): Promise<ScenarioDocument[]> {
    const skip = (page - 1) * limit;
    return (await this.model
      .find({ createdBy: userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()
      .exec()) as unknown as ScenarioDocument[];
  }

  async countByUserId(userId: string): Promise<number> {
    return await this.model.countDocuments({ createdBy: userId }).exec();
  }

  private buildQuery(filters: ScenarioFilters): any {
    const query: any = {};

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.createdBy) {
      query.createdBy = filters.createdBy;
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return query;
  }
}

// Made with Bob
