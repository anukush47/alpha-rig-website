import { blogPost }           from "./blogPost";
import { blogSeries }         from "./blogSeries";
import { customBuild }        from "./customBuild";
import { event }              from "./event";
import { eventRegistration }  from "./eventRegistration";
import { product }            from "./product";
import { subscriber }         from "./subscriber";
import { sponsor }            from "./sponsor";
import { adSlot }             from "./adSlot";
import { partnershipInquiry } from "./partnershipInquiry";
import { userProfile }        from "./userProfile";
import { userOrder }          from "./userOrder";
import { wishlistItem }       from "./wishlistItem";
import { savedBuild }         from "./savedBuild";
import { alphaPoints }        from "./alphaPoints";

export const schemaTypes = [
  // Content
  blogPost,
  blogSeries,
  customBuild,
  event,
  eventRegistration,
  product,
  // Audience
  subscriber,
  userProfile,
  userOrder,
  wishlistItem,
  savedBuild,
  alphaPoints,
  // Monetization
  sponsor,
  adSlot,
  partnershipInquiry,
];
