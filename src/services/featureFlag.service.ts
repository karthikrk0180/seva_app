/**
 * Feature Flag Service
 * Manages remote configuration and feature toggles.
 * Should wrap a provider like Firebase Remote Config or PostHog.
 */

export interface FeatureFlags {
  sevaEnabled: boolean;
  paryayaEnabled: boolean;
  newHomeDesign: boolean;
  maintenanceMode: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  sevaEnabled: true,
  paryayaEnabled: false,
  newHomeDesign: false,
  maintenanceMode: false,
};

class FeatureFlagService {
  private flags: FeatureFlags = DEFAULT_FLAGS;

  // Simulate loading flags from a remote source
  public async loadFlags(): Promise<FeatureFlags> {
    // TODO: Integrate Firebase Remote Config fetchAndActivate()
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock remote values
        this.flags = {
          ...DEFAULT_FLAGS,
          paryayaEnabled: true, // Example override
        };
        resolve(this.flags);
      }, 500);
    });
  }

  public getFlag(key: keyof FeatureFlags): boolean {
    return this.flags[key];
  }

  public getAllFlags(): FeatureFlags {
    return { ...this.flags };
  }
}

export const featureFlagService = new FeatureFlagService();
