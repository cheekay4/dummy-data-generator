import type { Industry, Lead } from '../../types/index.js';
import type { ProductId } from '../../config/products.js';
import { ecRetailTemplate } from './ec-retail.js';
import { restaurantTemplate } from './restaurant.js';
import { gymTemplate } from './gym.js';
import { saasTemplate } from './saas.js';
import { genericTemplate } from './generic.js';
import { rrRestaurantTemplate } from './rr-restaurant.js';
import { rrBeautyTemplate } from './rr-beauty.js';
import { rrClinicTemplate } from './rr-clinic.js';
import { rrHotelTemplate } from './rr-hotel.js';
import { rrGenericTemplate } from './rr-generic.js';

export interface IndustryTemplate {
  subject: (lead: Lead) => string;
  bodyText: (lead: Lead) => string;
  bodyHtml: (lead: Lead) => string;
}

const msgscoreTemplates: Record<Industry, IndustryTemplate> = {
  ec_retail: ecRetailTemplate,
  restaurant: restaurantTemplate,
  gym: gymTemplate,
  saas: saasTemplate,
  other: genericTemplate,
};

const reviewReplyTemplates: Record<string, IndustryTemplate> = {
  restaurant: rrRestaurantTemplate,
  beauty: rrBeautyTemplate,
  gym: rrGenericTemplate,
  realestate: rrGenericTemplate,
  school: rrGenericTemplate,
  ec_retail: rrGenericTemplate,
  saas: rrGenericTemplate,
  other: rrGenericTemplate,
  clinic: rrClinicTemplate,
  hotel: rrHotelTemplate,
};

export function getIndustryTemplate(industry: Industry | string, product?: ProductId): IndustryTemplate {
  if (product === 'review-reply-ai') {
    return reviewReplyTemplates[industry] ?? rrGenericTemplate;
  }
  return msgscoreTemplates[industry as Industry] ?? genericTemplate;
}
