export interface BuildSpec {
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  cooling: string;
  psu: string;
  case: string;
  motherboard: string;
}

export interface Build {
  slug: string;
  name: string;
  tag: string;
  description: string;
  category: "water-cooled" | "air-cooled" | "rgb" | "compact";
  price: string;
  specs: BuildSpec;
  featured?: boolean;
}

export const BUILDS: Build[] = [
  {
    slug: "dragons-breath",
    name: "DRAGON'S BREATH",
    tag: "WATER COOLED · RGB",
    description:
      "Our flagship build — custom hardline water loop with a 480mm radiator up top and a 360mm front-mount. The RTX 4090 sits in a vertical mount behind a full acrylic side panel. This is the machine that makes rooms go quiet.",
    category: "water-cooled",
    price: "₹3,85,000",
    featured: true,
    specs: {
      gpu: "RTX 4090 24GB",
      cpu: "i9-14900K",
      ram: "64GB DDR5-6400",
      storage: "4TB NVMe Gen5",
      cooling: "Custom Hardline Loop",
      psu: "1200W Platinum",
      case: "Lian Li O11 XL",
      motherboard: "ROG Maximus Z790",
    },
  },
  {
    slug: "obsidian-forge",
    name: "OBSIDIAN FORGE",
    tag: "AIR COOLED · STEALTH",
    description:
      "All-black stealth build with zero RGB and maximum performance. The NH-D15 keeps the 13900K butter-cool at full PBO. Dead silent at idle, a focused roar under load. Built for creators who need sustained throughput — not a light show.",
    category: "air-cooled",
    price: "₹2,10,000",
    specs: {
      gpu: "RTX 4080 Super 16GB",
      cpu: "i9-13900K",
      ram: "32GB DDR5-5600",
      storage: "2TB NVMe Gen4",
      cooling: "Noctua NH-D15",
      psu: "850W Gold",
      case: "Fractal Define 7",
      motherboard: "ASUS ProArt Z790",
    },
  },
  {
    slug: "crimson-tide",
    name: "CRIMSON TIDE",
    tag: "WATER COOLED · HIGH-FPS",
    description:
      "Built from the ground up for competitive esports at maximum framerate. The R9 7950X3D paired with an RX 7900 XTX demolishes 1080p and 1440p esports titles. Custom soft-tube loop with red coolant and a UV-reactive cable mod.",
    category: "water-cooled",
    price: "₹2,60,000",
    specs: {
      gpu: "RX 7900 XTX 24GB",
      cpu: "Ryzen 9 7950X3D",
      ram: "32GB DDR5-6000",
      storage: "2TB NVMe Gen4",
      cooling: "Soft-Tube Custom Loop",
      psu: "1000W Gold",
      case: "Corsair 5000D Airflow",
      motherboard: "MSI MEG X670E ACE",
    },
  },
  {
    slug: "phantom-rig",
    name: "PHANTOM RIG",
    tag: "COMPACT · ITX",
    description:
      "Maximum power in minimum space. This ITX monster fits inside a 20L case while packing a 4070 Ti Super and a 13700K — a build that proves size means nothing. Travel-friendly, LAN-party ready.",
    category: "compact",
    price: "₹1,75,000",
    specs: {
      gpu: "RTX 4070 Ti Super 16GB",
      cpu: "i7-13700K",
      ram: "32GB DDR5-5200",
      storage: "1TB NVMe Gen4",
      cooling: "Noctua NH-L12S",
      psu: "850W SFX Gold",
      case: "Cooler Master NR200P",
      motherboard: "ASUS ROG Strix Z790-I",
    },
  },
  {
    slug: "nova-station",
    name: "NOVA STATION",
    tag: "RGB · WORKSTATION",
    description:
      "Content creation powerhouse with 192GB of ECC RAM and a Threadripper Pro 5975WX at its core. Dual 8K display output, 10GbE networking, and a 4U rack-ready chassis for serious studios.",
    category: "rgb",
    price: "₹5,50,000",
    specs: {
      gpu: "RTX 4090 24GB × 2",
      cpu: "Threadripper PRO 5975WX",
      ram: "192GB ECC DDR4",
      storage: "8TB NVMe RAID",
      cooling: "Custom Loop + Chiller",
      psu: "1600W Titanium",
      case: "Lian Li O11 XL EVO",
      motherboard: "WRX80 Creator",
    },
  },
  {
    slug: "iron-wolf",
    name: "IRON WOLF",
    tag: "AIR COOLED · BUDGET",
    description:
      "Our most accessible build — no compromises where it counts. The RX 7700 XT and Ryzen 5 7600X deliver solid 1080p 144fps gaming. Triple-fan air cooler, cable-managed to perfection. Value redefined.",
    category: "air-cooled",
    price: "₹85,000",
    specs: {
      gpu: "RX 7700 XT 12GB",
      cpu: "Ryzen 5 7600X",
      ram: "16GB DDR5-5200",
      storage: "1TB NVMe Gen4",
      cooling: "DeepCool AK620",
      psu: "650W Gold",
      case: "Antec P120 Crystal",
      motherboard: "B650 Tomahawk",
    },
  },
];

export function getBuildBySlug(slug: string): Build | undefined {
  return BUILDS.find((b) => b.slug === slug);
}

export function getRelatedBuilds(slug: string, count = 3): Build[] {
  return BUILDS.filter((b) => b.slug !== slug).slice(0, count);
}
