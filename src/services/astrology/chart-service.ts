import { logger } from "../../lib/logger";
import { westernCalculator } from "./western/calculations";
import { vedicCalculator } from "./vedic/calculations";
import type { 
  BirthChartData, 
  ChartResult, 
  ChartService,
  ChartInterpretation,
  ChartState,
  ChartCache,
  WesternChartResult,
  VedicChartResult
} from "./types";

class AstrologyChartService implements ChartService {
  private state: ChartState = {
    westernChart: null,
    vedicChart: null,
    interpretation: null,
    isLoading: false,
    error: null
  };

  private subscribers: Set<(state: ChartState) => void> = new Set();

  private cache = new Map<string, ChartCache>();

  subscribe(callback: (state: ChartState) => void) {
    this.subscribers.add(callback);
    callback(this.state);
    return () => this.subscribers.delete(callback);
  }

  private setState(newState: Partial<ChartState>) {
    this.state = { ...this.state, ...newState };
    this.notifySubscribers();
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.state));
  }

  private getCacheKey(data: BirthChartData): string {
    return `chart-${data.birthDate}-${data.birthTime}-${data.birthPlace}`;
  }

  async calculateWesternChart(data: BirthChartData): Promise<WesternChartResult> {
    try {
      this.setState({ isLoading: true, error: null });
      
      const cacheKey = this.getCacheKey(data);
      const cached = await this.getCachedChart(cacheKey);
      
      if (cached?.chart.system === 'western') {
        logger.debug("Using cached Western chart", { cacheKey });
        this.setState({ westernChart: cached.chart as WesternChartResult });
        return cached.chart as WesternChartResult;
      }

      logger.info("Calculating new Western chart", {
        date: data.birthDate,
        place: data.birthPlace
      });

      const chart = westernCalculator.calculateBirthChart(data);
      this.setState({ westernChart: chart });
      return chart;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error("Western chart calculation failed", { error });
      this.setState({ error: new Error(errorMessage) });
      throw error;
    } finally {
      this.setState({ isLoading: false });
    }
  }

  async calculateVedicChart(data: BirthChartData): Promise<VedicChartResult> {
    try {
      this.setState({ isLoading: true, error: null });
      
      const cacheKey = this.getCacheKey(data);
      const cached = await this.getCachedChart(cacheKey);
      
      if (cached?.chart.system === 'vedic') {
        logger.debug("Using cached Vedic chart", { cacheKey });
        this.setState({ vedicChart: cached.chart as VedicChartResult });
        return cached.chart as VedicChartResult;
      }

      logger.info("Calculating new Vedic chart", {
        date: data.birthDate,
        place: data.birthPlace
      });

      const chart = vedicCalculator.calculateBirthChart(data);
      this.setState({ vedicChart: chart });
      return chart;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error("Vedic chart calculation failed", { error });
      this.setState({ error: new Error(errorMessage) });
      throw error;
    } finally {
      this.setState({ isLoading: false });
    }
  }

  async interpretChart(chart: ChartResult): Promise<ChartInterpretation> {
    try {
      this.setState({ isLoading: true, error: null });

      // This would typically call an AI service or database
      // For now, return a placeholder interpretation
      const interpretation: ChartInterpretation = {
        chartId: 'placeholder',
        content: 'Placeholder interpretation',
        sections: [
          {
            title: 'Overview',
            content: 'Your chart shows...',
            icon: 'star'
          }
        ],
        metadata: {
          generatedAt: new Date().toISOString(),
          version: '1.0'
        }
      };

      this.setState({ interpretation });
      return interpretation;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error("Chart interpretation failed", { error });
      this.setState({ error: new Error(errorMessage) });
      throw error;
    } finally {
      this.setState({ isLoading: false });
    }
  }

  async saveChart(chart: ChartResult, userId?: string): Promise<string> {
    // This would typically save to a database
    // For now, just return a placeholder ID
    return 'chart-123';
  }

  async loadChart(chartId: string): Promise<ChartResult> {
    // This would typically load from a database
    // For now, throw an error
    throw new Error('Not implemented');
  }

  private async getCachedChart(key: string): Promise<ChartCache | null> {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // Cache valid for 24 hours
    if (Date.now() - cached.timestamp > 24 * 60 * 60 * 1000) {
      this.cache.delete(key);
      return null;
    }

    return cached;
  }

  async clearCache(): Promise<void> {
    this.cache.clear();
  }

  getState(): ChartState {
    return this.state;
  }
}

export const chartService = new AstrologyChartService();
