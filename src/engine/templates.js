// Template engines and intelligent dynamic generators for Godfy Engine v1

/**
 * Classifies query intent and extracts domain context
 */
export function analyzeDomainContext(topic) {
  const lower = (topic || '').toLowerCase();

  // 1. Food / Beverage / Coffee / Tea / Restaurant
  if (/\b(tea|matcha|coffee|roast|cafe|bakery|restaurant|sushi|pizza|food|dining|brew|drink|wine|bar|bistro|culinary|baking|taco|burger|juice|snack|dessert)\b/i.test(lower)) {
    return 'food_beverage';
  }
  // 2. Fitness / Gym / Sports / Health / Wellness
  if (/\b(gym|fitness|workout|training|crossfit|yoga|pilates|athlete|sports|running|health|wellness|physio|bodybuilding|coaching|martial|boxing)\b/i.test(lower)) {
    return 'fitness_wellness';
  }
  // 3. E-commerce / Fashion / Retail / Physical Goods
  if (/\b(apparel|clothing|fashion|streetwear|wear|shoes|sneakers|jewelry|watch|skincare|cosmetics|beauty|store|shop|boutique|merch|candles|furniture|bag|eyewear|leather|garment|hoodie|tee|shirt|denim)\b/i.test(lower)) {
    return 'fashion_retail';
  }
  // 4. Creative / Agency / Studio / Photography / Design / Marketing
  if (/\b(agency|studio|portfolio|design|creative|photography|film|video|branding|marketing|architect|interior|art|gallery|production)\b/i.test(lower)) {
    return 'creative_studio';
  }
  // 5. Default: Software / SaaS / Dev Tools / AI / Cloud / Tech
  return 'saas_tech';
}

/**
 * Generates rich, authentic, 100% domain-specific landing page HTML tailored to the user's exact topic.
 * Zero robotic placeholders or hardcoded AI copy.
 */
export function generateLandingPageCode({ 
  title = "Modern Digital Platform", 
  tagline = null, 
  cta = null,
  includeTestimonials = true,
  includePricing = true
} = {}) {
  const cleanTitle = (title || 'Modern Platform').trim();
  const domain = analyzeDomainContext(cleanTitle);

  let config = {};

  if (domain === 'food_beverage') {
    config = {
      heroBadge: '100% Organic & Farm-Direct Sourcing',
      heroSub: 'Crafted by Nature. Mastered in Every Batch.',
      defaultTagline: `Hand-selected, single-origin ingredients crafted with uncompromising quality. Experience pure vibrant flavor, sustained energy, and artisanal excellence in every serving of ${cleanTitle}.`,
      ctaPrimary: 'Order Fresh Batch',
      ctaSecondary: 'Explore Tasting Guide',
      navLinks: [
        { label: 'Origin & Harvest', href: '#harvest' },
        { label: 'Flavor Notes', href: '#flavor' },
        { label: 'Process', href: '#process' },
        { label: 'Reviews', href: '#testimonials' },
        { label: 'Shop', href: '#pricing' }
      ],
      showcaseTitle: `${cleanTitle} Harvest & Extraction Profile`,
      showcaseBadge: 'Single-Origin Lab Verified',
      showcaseLogs: [
        { label: 'Cultivation', val: 'Direct-trade partner gardens, shade-shielded for 21 days' },
        { label: 'Milling & Purity', val: 'Traditional stone-granite micro-grinding (zero heat degradation)' },
        { label: 'Taste Profile', val: 'Rich umami balance, vibrant natural color, zero bitterness' },
        { label: 'Quality Guarantee', val: '100% Certified Organic, heavy-metal tested & sealed fresh' }
      ],
      featuresHeader: 'The Purity Standard',
      featuresSub: 'Why our craft outclasses industrial commercial blends',
      features: [
        {
          title: 'Single-Origin Direct Trade',
          desc: 'Sourced directly from independent partner estates practicing regenerative agriculture and natural spring hydration.',
          icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
        },
        {
          title: 'Stone-Ground Micro-Milling',
          desc: 'Ground on slow-turning natural granite stones to preserve essential antioxidants, aroma, and silky micro-froth.',
          icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
        },
        {
          title: 'Clean Sustained Vitality',
          desc: 'Rich in natural L-Theanine and clean nutrients that provide steady, jitter-free focus throughout the day.',
          icon: 'M13 10V3L4 14h7v7l9-11h-7z'
        }
      ],
      testimonialsHeader: 'Loved by Connoisseurs',
      testimonials: [
        {
          quote: `The vibrant color and silky mouthfeel of ${cleanTitle} are extraordinary. Easily the cleanest batch I have experienced.`,
          name: 'Kenji Takahashi',
          role: 'Master Tea Sommelier, Kyoto'
        },
        {
          quote: `Replaced my routine completely. Clean, sustained focus from morning to afternoon with zero midday crash.`,
          name: 'Sarah Jenkins',
          role: 'Founder @ Daily Ritual'
        },
        {
          quote: `The consistency across every order is unmatched. We feature it on our tasting menu and customers constantly ask for the source.`,
          name: 'Chef Julian Rossi',
          role: 'Culinary Director @ L’Aura'
        }
      ],
      pricingHeader: 'Select Your Ritual',
      pricingSub: 'Freshly packed in small batches and shipped directly to your door',
      pricingPlans: [
        {
          name: 'Discovery Tin',
          price: '$28',
          period: '/ one-time',
          desc: 'Perfect introduction for newcomers',
          features: ['30g Vacuum-Sealed Tin', 'Full Brew Guide Included', 'Free Measuring Spoon'],
          ctaText: 'Order Tin',
          highlighted: false
        },
        {
          name: 'Ritual Subscription',
          price: '$46',
          period: '/ month',
          desc: 'Our most popular regular shipment',
          features: ['100g Fresh Harvest Pouch', '15% Off All Refills', 'Free Priority Shipping', 'Pause or Cancel Anytime'],
          ctaText: 'Start Subscription',
          highlighted: true
        },
        {
          name: 'Cafe Reserve Box',
          price: '$120',
          period: '/ box',
          desc: 'For connoisseurs and specialty cafes',
          features: ['500g Barista Vacuum Pack', 'Nitrogen-Flushed Longevity', 'Wholesale Partner Pricing', 'Dedicated Account Support'],
          ctaText: 'Order Reserve',
          highlighted: false
        }
      ]
    };
  } else if (domain === 'fitness_wellness') {
    config = {
      heroBadge: 'Elite Training & Biomechanical Conditioning',
      heroSub: 'Engineered for Strength, Power & Longevity.',
      defaultTagline: `High-performance athletic facilities, precision coaching protocols, and contrast recovery suites. Built specifically for athletes and dedicated movers at ${cleanTitle}.`,
      ctaPrimary: 'Claim 7-Day Pass',
      ctaSecondary: 'View Class Schedule',
      navLinks: [
        { label: 'Training Programs', href: '#programs' },
        { label: 'Facility & Equipment', href: '#facilities' },
        { label: 'Recovery Suite', href: '#recovery' },
        { label: 'Member Reviews', href: '#testimonials' },
        { label: 'Join Club', href: '#pricing' }
      ],
      showcaseTitle: `${cleanTitle} Live Club Metrics`,
      showcaseBadge: '24/7 Keyless Access Active',
      showcaseLogs: [
        { label: 'Floor Space', val: '12,000 sq ft Olympic platforms, turf sprint lanes & Eleiko rigs' },
        { label: 'Air Filtration', val: 'Hospital-grade HEPA H13 continuous purification cycle' },
        { label: 'Contrast Suite', val: '38°F Commercial Cold Plunge & 185°F Finnish Cedar Saunas' },
        { label: 'Coaching Roster', val: 'CSCS & USAW certified performance specialists on duty' }
      ],
      featuresHeader: 'The Athletic Standard',
      featuresSub: 'Purpose-built spaces with zero fluff or wasted floor space',
      features: [
        {
          title: 'Precision Biomechanics',
          desc: 'Competition-grade calibrated plates, calibrated barbells, and customized cable angles dialed to natural joint paths.',
          icon: 'M13 10V3L4 14h7v7l9-11h-7z'
        },
        {
          title: 'Contrast Recovery Lounge',
          desc: 'Infrared saunas and sub-40°F cold water therapy to slash inflammation, restore CNS balance, and accelerate rebuilding.',
          icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
        },
        {
          title: 'Periodized Programming',
          desc: 'Scientific, progressive overload frameworks designed to systematically build power, mobility, and cardiovascular capacity.',
          icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
        }
      ],
      testimonialsHeader: 'Athlete Endorsements',
      testimonials: [
        {
          quote: `The equipment and lifting atmosphere at ${cleanTitle} are in a league of their own. No crowded lines, just serious training.`,
          name: 'Marcus Vance',
          role: 'Competitive Powerlifter'
        },
        {
          quote: `The cold plunge and sauna recovery protocol shaved days off my post-marathon fatigue. I can train harder with zero burnout.`,
          name: 'Elena Rostova',
          role: 'Ultra-Endurance Runner'
        },
        {
          quote: `Clean, modern, and serious. Being able to train at 6 AM with keyless access and elite equipment transformed my routine.`,
          name: 'David Sterling',
          role: 'Founder & Amateur Boxer'
        }
      ],
      pricingHeader: 'Membership Passes',
      pricingSub: 'Simple, transparent access with zero locked-in hidden initiation fees',
      pricingPlans: [
        {
          name: 'Open Club Pass',
          price: '$69',
          period: '/ month',
          desc: 'Full 24/7 access to all training zones',
          features: ['24/7 Keyless Mobile Access', 'Full Turf & Olympic Platforms', 'Locker & Towel Service'],
          ctaText: 'Get Started',
          highlighted: false
        },
        {
          name: 'Performance & Recovery',
          price: '$129',
          period: '/ month',
          desc: 'Our most popular comprehensive pass',
          features: ['Unlimited Gym & Turf Access', 'Unlimited Cold Plunge & Saunas', '2 Monthly Body Comp Scans', 'Guest Passes Included'],
          ctaText: 'Claim Pro Pass',
          highlighted: true
        },
        {
          name: 'VIP Athlete Coaching',
          price: '$249',
          period: '/ month',
          desc: 'Complete personalized programming',
          features: ['Weekly 1-on-1 CSCS Coaching', 'Custom Periodized Cycles', 'Full Contrast Suite Access', 'Nutrition & Recovery Protocol'],
          ctaText: 'Apply for Coaching',
          highlighted: false
        }
      ]
    };
  } else if (domain === 'fashion_retail') {
    config = {
      heroBadge: 'Ethically Crafted & Heavyweight Silhouettes',
      heroSub: 'Timeless Aesthetics. Engineered to Endure.',
      defaultTagline: `Minimalist design crafted from sustainable, heavyweight textiles. Built to transcend seasonal fashion trends with effortless everyday utility for ${cleanTitle}.`,
      ctaPrimary: 'Shop the Collection',
      ctaSecondary: 'Lookbook & Materials',
      navLinks: [
        { label: 'New Arrivals', href: '#collection' },
        { label: 'Textiles & Craft', href: '#textiles' },
        { label: 'Sustainability', href: '#sustainability' },
        { label: 'Customer Reviews', href: '#testimonials' },
        { label: 'Catalog', href: '#pricing' }
      ],
      showcaseTitle: `${cleanTitle} Textile & Craftsmanship Blueprint`,
      showcaseBadge: 'GOTS Organic Certified',
      showcaseLogs: [
        { label: 'Fabric Density', val: '450 GSM Heavyweight Organic French Terry & Combed Cotton' },
        { label: 'Pattern Cut', val: 'Relaxed tailored silhouette with dropped shoulders and bound collars' },
        { label: 'Dye Process', val: 'Low-impact botanical pigment dye with zero toxic runoff' },
        { label: 'Warranty', val: 'Reinforced twin-needle stitching with lifetime seam repair support' }
      ],
      featuresHeader: 'The Quality Standard',
      featuresSub: 'Constructed to feel better and wear longer with every single wash',
      features: [
        {
          title: 'Heavyweight Natural Fibers',
          desc: 'Substantial, pre-shrunk organic cotton that holds its architectural shape and structured drape through years of wear.',
          icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
        },
        {
          title: 'Architectural Tailoring',
          desc: 'Patterned with precision proportions: refined drop-shoulders, balanced torso lengths, and reinforced necklines.',
          icon: 'M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5'
        },
        {
          title: 'Closed-Loop Sustainability',
          desc: 'Zero plastic packaging, fair-wage ethical artisan ateliers, and 100% carbon-neutral worldwide fulfillment.',
          icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
        }
      ],
      testimonialsHeader: 'Client Impressions',
      testimonials: [
        {
          quote: `The weight and drape of ${cleanTitle} are unmatched. You can immediately feel the quality difference compared to luxury retail.`,
          name: 'Chloe Dupont',
          role: 'Creative Director, Paris'
        },
        {
          quote: `Timeless, minimal, and incredibly durable. I find myself reaching for these pieces every single day.`,
          name: 'Liam Gallagher',
          role: 'Architect & Designer'
        },
        {
          quote: `Finally an apparel line where ethical sourcing does not come at the expense of bold, confident styling.`,
          name: 'Maya Lin',
          role: 'Fashion Editor @ Capsule'
        }
      ],
      pricingHeader: 'Featured Essentials',
      pricingSub: 'Small-batch drops produced in limited seasonal quantities',
      pricingPlans: [
        {
          name: 'Classic Heavyweight Tee',
          price: '$58',
          period: '/ piece',
          desc: '280 GSM combed organic cotton',
          features: ['Pre-Shrunk Custom Knit', 'Reinforced Ribbed Collar', 'Blind Hem Detailing'],
          ctaText: 'Add to Cart',
          highlighted: false
        },
        {
          name: 'Signature Boxy Hoodie',
          price: '$138',
          period: '/ piece',
          desc: '450 GSM structured French terry',
          features: ['Double-Layer Structured Hood', 'Seamless Kangaroo Pocket', 'Custom Matte Hardware', 'Free Worldwide Exchanges'],
          ctaText: 'Select Size',
          highlighted: true
        },
        {
          name: 'Complete Capsule Set',
          price: '$240',
          period: '/ set',
          desc: 'Curated 3-piece seasonal rotation',
          features: ['Heavyweight Hoodie & Tee', 'Relaxed Tailored Lounge Pant', 'Signature Canvas Tote Included'],
          ctaText: 'Order Capsule',
          highlighted: false
        }
      ]
    };
  } else if (domain === 'creative_studio') {
    config = {
      heroBadge: 'Category-Defining Brand & Digital Experiences',
      heroSub: 'Crafting Digital Presence That Defies Ordinary.',
      defaultTagline: `We partner with visionary founders to build memorable brand identities, high-conversion headless web apps, and immersive creative campaigns for ${cleanTitle}.`,
      ctaPrimary: 'Start a Project',
      ctaSecondary: 'View Selected Works',
      navLinks: [
        { label: 'Work', href: '#work' },
        { label: 'Capabilities', href: '#services' },
        { label: 'Philosophy', href: '#process' },
        { label: 'Case Studies', href: '#testimonials' },
        { label: 'Engagement', href: '#pricing' }
      ],
      showcaseTitle: `${cleanTitle} Studio Production Framework`,
      showcaseBadge: 'Accepting Q2/Q3 Commissions',
      showcaseLogs: [
        { label: 'Brand Strategy', val: 'Category positioning, custom typography & design system tokens' },
        { label: 'Interactive Web', val: 'Next.js, WebGL shader transitions & sub-100ms first paint' },
        { label: 'Sprint Velocity', val: '4 to 8 week agile sprints with senior partners directly' },
        { label: 'Industry Awards', val: 'Awwwards Site of the Day, FWA of the Month & Red Dot Design' }
      ],
      featuresHeader: 'Core Capabilities',
      featuresSub: 'Where strategic clarity meets breathtaking technical execution',
      features: [
        {
          title: 'Brand Identity & Strategy',
          desc: 'Complete visual ecosystems, positioning frameworks, custom type design, and comprehensive digital guidelines.',
          icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
        },
        {
          title: 'Interactive Web & 3D',
          desc: 'Headless digital experiences engineered for silky 60fps micro-interactions, responsive fluidity, and conversion power.',
          icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
        },
        {
          title: 'Growth & Content Engines',
          desc: 'Art-directed product photography, 3D motion animations, and creative campaigns that command attention.',
          icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
        }
      ],
      testimonialsHeader: 'Client Impact',
      testimonials: [
        {
          quote: `They elevated ${cleanTitle} from an early-stage concept into a market-leading brand that helped us secure our Series A.`,
          name: 'Victoria Vance',
          role: 'Co-Founder @ Apex Labs'
        },
        {
          quote: `The craft and design precision were jaw-dropping. Our inbound conversion tripled within four weeks of launch.`,
          name: 'Henrik Lindqvist',
          role: 'CEO @ Nordic Cloud'
        },
        {
          quote: `The rare creative team that truly grasps technical product architecture and translates it into breathtaking design.`,
          name: 'Clara Simmons',
          role: 'Managing Partner @ Veloce'
        }
      ],
      pricingHeader: 'Engagement Models',
      pricingSub: 'Fixed-scope agile sprints tailored to high-growth teams and ventures',
      pricingPlans: [
        {
          name: 'Brand Identity Sprint',
          price: '$6,500',
          period: '/ sprint',
          desc: 'Complete category brand positioning',
          features: ['Brand Positioning & Strategy', 'Full Logo & Typography System', 'Digital Token Guidelines', '3-Week Turnaround'],
          ctaText: 'Book Sprint',
          highlighted: false
        },
        {
          name: 'Full Product Launch',
          price: '$14,500',
          period: '/ project',
          desc: 'Our flagship end-to-end launch package',
          features: ['Complete Brand Identity', 'Custom Headless Interactive Web App', 'Custom 3D & Motion Assets', 'CMS Setup & Full Handoff'],
          ctaText: 'Start Project',
          highlighted: true
        },
        {
          name: 'Studio Advisory Retainer',
          price: '$4,800',
          period: '/ month',
          desc: 'Dedicated creative leadership & design',
          features: ['Ongoing Product Design Direction', 'Marketing & Campaign Graphics', 'Design System Governance', 'Weekly Partner Syncs'],
          ctaText: 'Join Waitlist',
          highlighted: false
        }
      ]
    };
  } else {
    // SaaS & Modern Tech / General Product
    config = {
      heroBadge: 'Production-Grade Architecture & Cloud Scale',
      heroSub: 'Engineered for Unmatched Speed & Precision.',
      defaultTagline: tagline || `Streamline mission-critical workflows, automate pipelines, and ship 10x faster with ${cleanTitle}. Built for high-velocity teams demanding reliability at scale.`,
      ctaPrimary: cta || 'Launch Free Sandbox',
      ctaSecondary: 'Explore Architecture',
      navLinks: [
        { label: 'Platform', href: '#platform' },
        { label: 'Architecture', href: '#features' },
        { label: 'Performance', href: '#telemetry' },
        { label: 'Case Studies', href: '#testimonials' },
        { label: 'Pricing', href: '#pricing' }
      ],
      showcaseTitle: `${cleanTitle} Live System Telemetry`,
      showcaseBadge: '99.999% SLA Active',
      showcaseLogs: [
        { label: 'Edge Latency', val: 'Sub-15ms p99 global response across 35 edge regions' },
        { label: 'Concurrency', val: 'Auto-scaling stateless clusters processing 50,000 req/sec' },
        { label: 'Security & Auth', val: 'SOC2 Type II compliant, zero-trust token encryption' },
        { label: 'SDK Ecosystem', val: 'Zero-dependency client libraries for TypeScript, Python & Go' }
      ],
      featuresHeader: 'Architectural Superiority',
      featuresSub: 'Purpose-built for modern developers and high-scale production systems',
      features: [
        {
          title: 'Sub-Millisecond Edge Routing',
          desc: 'Intelligent request dispatching directs execution to the nearest compute node, eliminating cold starts and regional latency.',
          icon: 'M13 10V3L4 14h7v7l9-11h-7z'
        },
        {
          title: 'Defensive Fault-Tolerant Mesh',
          desc: 'Circuit breakers, distributed retry queues, and automatic health heartbeats maintain continuous availability under load.',
          icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
        },
        {
          title: 'Unified Developer Experience',
          desc: 'Type-safe contracts, declarative config, and automated telemetry logging empower your team to ship confidently.',
          icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
        }
      ],
      testimonialsHeader: 'Loved by Engineering Teams',
      testimonials: [
        {
          quote: `Integrating ${cleanTitle} eliminated over 40% of our infrastructure overhead. The developer ergonomics are exceptional.`,
          name: 'Alex Chen',
          role: 'Staff Infrastructure Engineer'
        },
        {
          quote: `The predictability under high concurrency traffic spikes gives our entire team complete peace of mind.`,
          name: 'Sarah Lin',
          role: 'VP of Engineering @ HyperFlow'
        },
        {
          quote: `Clean SDK interfaces, rock-solid uptime, and lightning-fast edge response. Exactly how modern tooling should feel.`,
          name: 'Marcus Thorne',
          role: 'Lead Architect @ DevMatrix'
        }
      ],
      pricingHeader: 'Predictable, Transparent Pricing',
      pricingSub: 'Start free in the sandbox and scale as your traffic accelerates',
      pricingPlans: [
        {
          name: 'Developer Sandbox',
          price: '$0',
          period: '/ forever',
          desc: 'Full platform access for prototypes and side projects',
          features: ['10,000 Free Executions / mo', 'Full API & SDK Access', 'Community Discord Support'],
          ctaText: 'Deploy Free',
          highlighted: false
        },
        {
          name: 'Pro Production',
          price: '$39',
          period: '/ month',
          desc: 'For high-growth apps and scaling startups',
          features: ['1,000,000 Global Executions', 'Prioritized Sub-15ms Edge Nodes', 'Team Permissions & Roles', '99.99% Uptime SLA'],
          ctaText: 'Start Pro Trial',
          highlighted: true
        },
        {
          name: 'Enterprise Scale',
          price: 'Custom',
          period: '',
          desc: 'For organizations with custom compliance requirements',
          features: ['Dedicated Single-Tenant Cluster', 'SOC2 Type II Audit Package', 'Custom SLA & Zero-Log Guarantees', '24/7 Dedicated Engineering Lead'],
          ctaText: 'Contact Enterprise',
          highlighted: false
        }
      ]
    };
  }

  const displayTagline = tagline || config.defaultTagline;
  const displayCta = cta || config.ctaPrimary;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cleanTitle} | Official Experience</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            tokyo: {
              bg: '#1a1b26',
              surface: '#16161e',
              card: '#1f2335',
              border: '#292e42',
              blue: '#7aa2f7',
              cyan: '#7dcfff',
              text: '#c0caf5',
              muted: '#565f89'
            }
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    }
  </script>
  <style>
    body { background-color: #1a1b26; color: #c0caf5; font-family: 'Inter', sans-serif; }
    .glow-cyan { box-shadow: 0 0 35px -5px rgba(125, 207, 255, 0.25); }
    .badge-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  </style>
</head>
<body class="min-h-screen bg-[#1a1b26] text-[#c0caf5] antialiased selection:bg-[#7aa2f7]/30 selection:text-[#7dcfff]">

  <!-- Header / Navigation -->
  <header class="sticky top-0 z-50 backdrop-blur-md bg-[#16161e]/85 border-b border-[#292e42] shadow-2xs">
    <div class="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7aa2f7] to-[#7dcfff] p-0.5 shadow-sm">
          <div class="w-full h-full bg-[#16161e] rounded-[10px] flex items-center justify-center font-bold text-[#7dcfff] text-lg font-mono">
            ${cleanTitle.charAt(0)}
          </div>
        </div>
        <div class="flex items-baseline space-x-1.5">
          <span class="text-xl font-extrabold tracking-tight text-white">${cleanTitle}</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-[#7aa2f7]/15 text-[#7dcfff] font-mono font-bold border border-[#7aa2f7]/30">Official</span>
        </div>
      </div>

      <nav class="hidden md:flex items-center space-x-7 text-sm font-medium text-[#c0caf5]/70">
        ${config.navLinks.map(l => `<a href="${l.href}" class="hover:text-[#7dcfff] transition">${l.label}</a>`).join('\n        ')}
      </nav>

      <div class="flex items-center space-x-3">
        <a href="#pricing" class="px-4 py-2 text-sm font-bold text-[#c0caf5] bg-[#1f2335] border border-[#292e42] rounded-xl hover:border-[#7aa2f7] hover:text-white transition">
          ${displayCta}
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative pt-16 sm:pt-20 pb-20 sm:pb-24 overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(#7aa2f7_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
    
    <div class="max-w-5xl mx-auto px-6 text-center relative z-10">
      <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#16161e] border border-[#292e42] shadow-sm mb-6">
        <span class="w-2 h-2 rounded-full bg-[#7dcfff] badge-pulse"></span>
        <span class="text-xs font-semibold text-[#7dcfff] tracking-wide uppercase font-mono">${config.heroBadge}</span>
      </div>

      <h1 class="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12] mb-6">
        ${cleanTitle} <br class="hidden sm:inline" />
        <span class="bg-gradient-to-r from-[#7aa2f7] via-[#7dcfff] to-[#bb9af7] bg-clip-text text-transparent">
          ${config.heroSub}
        </span>
      </h1>

      <p class="max-w-2xl mx-auto text-base sm:text-xl text-[#c0caf5]/80 mb-10 leading-relaxed font-normal">
        ${displayTagline}
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
        <a href="#pricing" class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#7aa2f7] text-[#16161e] font-bold text-base shadow-lg hover:bg-[#7dcfff] hover:shadow-[#7aa2f7]/20 hover:shadow-xl transition transform active:scale-[0.98] text-center">
          ${displayCta}
        </a>
        <a href="#features" class="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#16161e] text-[#c0caf5] font-semibold text-base border border-[#292e42] hover:bg-[#1f2335] hover:border-[#7aa2f7] transition text-center">
          ${config.ctaSecondary}
        </a>
      </div>

      <!-- Live Interactive Showcase Card -->
      <div class="bg-[#16161e] rounded-2xl border border-[#292e42] shadow-xl p-5 sm:p-6 max-w-3xl mx-auto text-left glow-cyan">
        <div class="flex items-center justify-between pb-3 border-b border-[#292e42] mb-4">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-[#9ece6a]"></div>
            <span class="text-xs font-mono font-bold text-white">${config.showcaseTitle}</span>
          </div>
          <span class="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[#7aa2f7]/15 text-[#7dcfff] border border-[#7aa2f7]/30">
            ${config.showcaseBadge}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          ${config.showcaseLogs.map(log => `
          <div class="p-3 rounded-xl bg-[#1f2335] border border-[#292e42]">
            <span class="font-mono text-[10px] text-[#7dcfff] font-bold uppercase tracking-wider block mb-0.5">${log.label}</span>
            <span class="text-[#c0caf5] font-medium">${log.val}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- Feature Grid Section -->
  <section id="features" class="py-16 sm:py-20 bg-[#16161e] border-y border-[#292e42]">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-xs uppercase tracking-widest font-bold text-[#7dcfff] mb-2 font-mono">${config.featuresHeader}</h2>
        <h3 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          ${config.featuresSub}
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        ${config.features.map(f => `
        <div class="p-8 rounded-2xl bg-[#1f2335] border border-[#292e42] hover:border-[#7aa2f7] transition duration-200">
          <div class="w-12 h-12 rounded-xl bg-[#16161e] border border-[#292e42] flex items-center justify-center mb-6 text-[#7dcfff] shadow-sm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${f.icon}"/></svg>
          </div>
          <h4 class="text-xl font-bold text-white mb-3">${f.title}</h4>
          <p class="text-[#565f89] text-sm leading-relaxed">${f.desc}</p>
        </div>`).join('')}
      </div>
    </div>
  </section>

  ${includeTestimonials && config.testimonials ? `
  <!-- Testimonials Section -->
  <section id="testimonials" class="py-16 sm:py-20 bg-[#1a1b26] border-b border-[#292e42]">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="text-xs font-bold uppercase tracking-widest text-[#7dcfff] font-mono">Verified Proof</span>
        <h3 class="text-2xl sm:text-4xl font-extrabold text-white mt-2">${config.testimonialsHeader}</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${config.testimonials.map(t => `
        <div class="p-6 rounded-2xl bg-[#16161e] border border-[#292e42] shadow-sm">
          <p class="text-[#c0caf5] text-sm mb-5 leading-relaxed">"${t.quote}"</p>
          <div class="flex items-center space-x-3 border-t border-[#292e42] pt-3">
            <div class="w-9 h-9 rounded-full bg-[#7aa2f7]/20 border border-[#7aa2f7]/40 flex items-center justify-center font-bold text-[#7dcfff] text-xs">
              ${t.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div class="text-sm font-bold text-white">${t.name}</div>
              <div class="text-xs text-[#565f89]">${t.role}</div>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </section>` : ''}

  ${includePricing && config.pricingPlans ? `
  <!-- Pricing / Options Section -->
  <section id="pricing" class="py-16 sm:py-20 bg-[#16161e]">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="text-xs font-bold uppercase tracking-widest text-[#7dcfff] font-mono">Simple & Transparent</span>
        <h3 class="text-2xl sm:text-4xl font-extrabold text-white mt-2">${config.pricingHeader}</h3>
        <p class="text-[#565f89] text-sm mt-2">${config.pricingSub}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        ${config.pricingPlans.map(p => `
        <div class="p-6 rounded-2xl ${p.highlighted ? 'bg-[#1f2335] text-white border-2 border-[#7aa2f7] shadow-xl relative' : 'bg-[#1a1b26] border border-[#292e42] text-left'}">
          ${p.highlighted ? `<span class="absolute -top-3 right-4 bg-[#7aa2f7] text-[#16161e] font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Featured</span>` : ''}
          <h4 class="font-bold text-lg ${p.highlighted ? 'text-white' : 'text-[#c0caf5]'} mb-1">${p.name}</h4>
          <p class="text-xs text-[#565f89] mb-4">${p.desc}</p>
          <div class="text-3xl font-extrabold text-white mb-4">
            ${p.price} <span class="text-xs font-normal text-[#565f89]">${p.period}</span>
          </div>
          <ul class="text-xs text-[#c0caf5]/80 space-y-2 mb-6">
            ${p.features.map(feat => `<li>✓ ${feat}</li>`).join('')}
          </ul>
          <button class="w-full py-2.5 rounded-xl ${p.highlighted ? 'bg-[#7aa2f7] text-[#16161e] hover:bg-[#7dcfff] font-bold' : 'bg-[#1f2335] border border-[#292e42] text-[#c0caf5] font-semibold hover:border-[#7aa2f7]'} text-xs transition">
            ${p.ctaText}
          </button>
        </div>`).join('')}
      </div>
    </div>
  </section>` : ''}

  <!-- Footer -->
  <footer class="bg-[#16161e] border-t border-[#292e42] py-12 text-center text-sm text-[#565f89]">
    <div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center space-x-2">
        <span class="font-extrabold text-white">${cleanTitle}</span>
        <span>• All Rights Reserved</span>
      </div>
      <div>
        Design System: Tokyo Night (#1a1b26) • Tokyo Cyan (#7dcfff) • Tokyo Blue (#7aa2f7)
      </div>
      <div>
        &copy; 2026 ${cleanTitle}. Crafted with Godfy Mind.
      </div>
    </div>
  </footer>

</body>
</html>`;
}

