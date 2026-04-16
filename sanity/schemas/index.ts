import { blogPost }            from "./blogPost";
import { blogSeries }          from "./blogSeries";
import { customBuild }         from "./customBuild";
import { event }               from "./event";
import { product }             from "./product";
import { subscriber }          from "./subscriber";
import { sponsor }             from "./sponsor";
import { adSlot }              from "./adSlot";
import { partnershipInquiry }  from "./partnershipInquiry";

export const schemaTypes = [
  // Content
  blogPost,
  blogSeries,
  customBuild,
  event,
  product,
  // Audience
  subscriber,
  // Monetization
  sponsor,
  adSlot,
  partnershipInquiry,
];
