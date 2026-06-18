import { hashString } from "@/lib/utils";

export type SocietyExtraDetails = {
  address: string;
  city: string;
  areaSqft: number;
  unitsCount: number;
  logoUrl: string | null;
  admin: {
    name: string;
    email: string;
    phone: string;
  };
};

const ADDRESSES = [
  { address: "Plot 14, MVP Colony Main Road", city: "Visakhapatnam" },
  { address: "Survey No. 212, Gachibowli", city: "Hyderabad" },
  { address: "4th Cross, Indiranagar", city: "Bengaluru" },
  { address: "Tilak Nagar Extension", city: "Pune" },
  { address: "Sector 62, Noida", city: "Delhi NCR" },
];

const ADMIN_NAMES = [
  "Padma Konkonapala",
  "Arjun Rao",
  "Sneha Iyer",
  "Vikram Shetty",
  "Divya Menon",
];

export function getSocietyDetails(id: string, name: string): SocietyExtraDetails {
  const hash = hashString(id);
  const place = ADDRESSES[hash % ADDRESSES.length];
  const adminName = ADMIN_NAMES[hash % ADMIN_NAMES.length];
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "");

  return {
    address: place.address,
    city: place.city,
    areaSqft: 40000 + (hash % 12) * 5000,
    unitsCount: 60 + (hash % 8) * 20,
    logoUrl: null,
    admin: {
      name: adminName,
      email: `${adminName.split(" ")[0].toLowerCase()}@${slug || "society"}.com`,
      phone: `+91 9${(hash % 900000000).toString().padStart(9, "0")}`,
    },
  };
}
