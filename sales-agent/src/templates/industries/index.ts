import type { Industry, Lead } from '../../types/index.js';
import { ecRetailTemplate } from './ec-retail.js';
import { restaurantTemplate } from './restaurant.js';
import { gymTemplate } from './gym.js';
import { saasTemplate } from './saas.js';
import { genericTemplate } from './generic.js';

export interface IndustryTemplate {
  subject: (lead: Lead) => string;
  bodyText: (lead: Lead) => string;
  bodyHtml: (lead: Lead) => string;
}

const templates: Record<Industry, IndustryTemplate> = {
  ec_retail: ecRetailTemplate,
  restaurant: restaurantTemplate,
  gym: gymTemplate,
  saas: saasTemplate,
  other: genericTemplate,
};

export function getIndustryTemplate(industry: Industry): IndustryTemplate {
  return templates[industry] ?? genericTemplate;
}
