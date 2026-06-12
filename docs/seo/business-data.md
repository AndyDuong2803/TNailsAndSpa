# Business SEO Data

## Inputs
- Website: https://tnailandspa.com/
- Google Maps: https://maps.app.goo.gl/uDKmsYCif3B47d3c9

## Sources Crawled
| Source | URL | Status | Notes |
| --- | --- | --- | --- |
| Current website homepage | https://tnailandspa.com/ | Success | Firecrawl returned page metadata, visible contact details, services, internal links, images and existing favicon. |
| Website URL map | https://tnailandspa.com/ | Success | Firecrawl found one public canonical page. The site is a one-page static website with section anchors. |
| Existing sitemap | https://tnailandspa.com/sitemap.xml | Failed | Returned GitHub Pages 404. A new sitemap was added. |
| Existing robots | https://tnailandspa.com/robots.txt | Success | Returned GitHub Pages default content-signal text, not a project robots file. A project robots file was added with a sitemap directive. |
| Google Maps listing | https://maps.app.goo.gl/uDKmsYCif3B47d3c9 | Partial success | Firecrawl reached the listing and extracted name, address, phone, website, category, coordinates, rating and limited hours. Review count was unavailable. |

## Extracted Data
| Field | Value | Source | Confidence | Used in site? |
| --- | --- | --- | --- | --- |
| Business name | T Nails and Spa | Website homepage and Google Maps | High | Yes |
| Business category | Nail salon | Website homepage and Google Maps | High | Yes |
| Website URL | https://tnailandspa.com/ | User input, website crawl and Google Maps | High | Yes |
| Canonical URL | https://tnailandspa.com/ | Website crawl and user input | High | Yes |
| Address | 16655 Yonge St Unit 22, Newmarket, ON L3X 1V6, Canada | Google Maps listing | High | Yes |
| Address spelling conflict | Website used "Younge"; Google Maps used "Yonge" | Website homepage and Google Maps | Medium | Corrected visible site and schema to Google Maps spelling |
| Phone | +1 905-235-9008 | Website homepage and Google Maps | High | Yes |
| Email | tnailspa6888@gmail.com | Website homepage | High | Yes |
| Booking URL | https://tnail.veceebooking.com/ | Website homepage | High | Yes |
| Facebook URL | https://www.facebook.com/tnailsandspa2023/ | Existing site footer | Medium | Yes |
| Google Maps URL | https://maps.app.goo.gl/uDKmsYCif3B47d3c9 | User input and Google Maps crawl | High | Yes |
| Coordinates | 44.0354625, -79.4729221 | Google Maps URL/crawl | High | Yes |
| Logo | https://tnailandspa.com/assets/images/Lldw-template-01-logo-5a3482cf24.png | Website crawl and project assets | High | Yes |
| Primary image | https://tnailandspa.com/assets/images/Elite-nails-spa-banner-03-414ecc9713.jpg | Website crawl and project assets | High | Yes |
| Services | Manicures, pedicures, acrylic nails, gel nails, waxing and related nail services | Website homepage and local services markup | High | Yes |
| Prices | Visible service menu prices from $5 to $90 | Website homepage and local services markup | High | Documented only |
| Opening hours | Website: Mon-Fri 10:00 AM-7:30 PM, Saturday 10:00 AM-6:00 PM, Sunday 10:00 AM-5:00 PM. Google Maps crawl only returned Wednesday 10 AM-7:30 PM and Thursday closed. | Website homepage and Google Maps | Medium | Visible site unchanged; omitted from JSON-LD pending confirmation |
| Rating | 4.8 | Google Maps crawl | Medium | Documented only |

## Failed Or Missing Fields
| Field | Status | Notes |
| --- | --- | --- |
| Google review count | Missing | Google Maps crawl returned rating but not review count. AggregateRating was not added. |
| Full Google Business Profile hours | Partial/conflicting | Google Maps only exposed limited hours and conflicted with website hours for Thursday. Confirm before adding openingHoursSpecification. |
| Instagram URL | Missing | Existing footer linked to the generic Instagram homepage, not a verified business profile. The generic link was removed. |
| Awards, "best", "No.1" or similar claims | Not verified | No unsupported claim was added. |

## Manual TODO
- [ ] Confirm the exact Google Business Profile opening hours, especially Thursday.
- [ ] Confirm whether the salon has an official Instagram profile URL.
- [ ] Confirm whether the Google rating can be paired with a current review count before adding aggregateRating.
- [ ] Confirm whether the service menu prices are current before marking them up as offers.

## Implementation Notes
- Updated homepage title, description, canonical URL, robots meta, Open Graph metadata, Twitter card metadata, favicon/apple-touch icon tags, WebSite JSON-LD and NailSalon JSON-LD.
- Created `sitemap.xml` for the canonical homepage URL.
- Created `robots.txt` with public crawl access and a sitemap directive.
- Corrected the phone display formatting and address spelling based on the Google Maps source.
- Replaced the stale footer Google Maps short link with the user-provided Maps URL and removed the unverified generic Instagram link.
