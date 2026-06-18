export type UserAccountStatus = "active" | "invited" | "suspended";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: UserAccountStatus;
  flatNumber: string | null;
  lastActiveAt: string | null;
  invitedAt: string;
};

export const roleOptions = [
  "Resident",
  "Tenant",
  "Society Admin",
  "Treasurer",
  "Committee Member",
  "Security Guard",
] as const;

export const users: UserRecord[] = [
  {
    id: "1",
    name: "Priya Sharma",
    email: "resident@greenvalley.com",
    phone: "+91 98765 43210",
    role: "Resident",
    status: "active",
    flatNumber: "304",
    lastActiveAt: "2026-06-18T08:10:00+05:30",
    invitedAt: "2025-01-12T10:00:00+05:30",
  },
  {
    id: "2",
    name: "Anil Reddy",
    email: "admin@greenvalley.com",
    phone: "+91 98765 11122",
    role: "Society Admin",
    status: "active",
    flatNumber: "101",
    lastActiveAt: "2026-06-18T07:40:00+05:30",
    invitedAt: "2024-11-02T10:00:00+05:30",
  },
  {
    id: "3",
    name: "Kavitha Rao",
    email: "kavitha.rao@gmail.com",
    phone: "+91 99887 76655",
    role: "Treasurer",
    status: "active",
    flatNumber: "204",
    lastActiveAt: "2026-06-17T19:20:00+05:30",
    invitedAt: "2025-02-20T10:00:00+05:30",
  },
  {
    id: "4",
    name: "Suresh Babu",
    email: "guard@greenvalley.com",
    phone: "+91 90000 12345",
    role: "Security Guard",
    status: "active",
    flatNumber: null,
    lastActiveAt: "2026-06-18T06:00:00+05:30",
    invitedAt: "2025-03-05T10:00:00+05:30",
  },
  {
    id: "5",
    name: "Lakshmi Narayanan",
    email: "lakshmi.n@gmail.com",
    phone: "+91 91234 56789",
    role: "Committee Member",
    status: "active",
    flatNumber: "402",
    lastActiveAt: "2026-06-16T12:15:00+05:30",
    invitedAt: "2025-04-18T10:00:00+05:30",
  },
  {
    id: "6",
    name: "Ramesh Iyer",
    email: "ramesh.iyer@outlook.com",
    phone: "+91 90909 80808",
    role: "Tenant",
    status: "invited",
    flatNumber: "104",
    lastActiveAt: null,
    invitedAt: "2026-06-14T10:00:00+05:30",
  },
  {
    id: "7",
    name: "Deepa Krishnan",
    email: "deepa.k@gmail.com",
    phone: "+91 93456 78901",
    role: "Resident",
    status: "active",
    flatNumber: "210",
    lastActiveAt: "2026-06-15T21:00:00+05:30",
    invitedAt: "2025-05-09T10:00:00+05:30",
  },
  {
    id: "8",
    name: "Vijay Kumar",
    email: "vijay.kumar@gmail.com",
    phone: "+91 98989 67676",
    role: "Resident",
    status: "suspended",
    flatNumber: "308",
    lastActiveAt: "2026-04-02T10:30:00+05:30",
    invitedAt: "2024-09-22T10:00:00+05:30",
  },
  {
    id: "9",
    name: "Meena Pillai",
    email: "meena.pillai@gmail.com",
    phone: "+91 97777 65432",
    role: "Committee Member",
    status: "invited",
    flatNumber: "503",
    lastActiveAt: null,
    invitedAt: "2026-06-17T10:00:00+05:30",
  },
  {
    id: "10",
    name: "Arjun Menon",
    email: "arjun.menon@gmail.com",
    phone: "+91 95555 43210",
    role: "Tenant",
    status: "active",
    flatNumber: "112",
    lastActiveAt: "2026-06-18T09:00:00+05:30",
    invitedAt: "2025-08-30T10:00:00+05:30",
  },
  {
    id: "11",
    name: "Geetha Subramanian",
    email: "geetha.s@gmail.com",
    phone: "+91 96666 54321",
    role: "Resident",
    status: "active",
    flatNumber: "401",
    lastActiveAt: "2026-06-13T17:45:00+05:30",
    invitedAt: "2024-12-15T10:00:00+05:30",
  },
  {
    id: "12",
    name: "Naveen Babu",
    email: "naveen.babu@gmail.com",
    phone: "+91 90123 45678",
    role: "Security Guard",
    status: "suspended",
    flatNumber: null,
    lastActiveAt: "2026-03-11T08:00:00+05:30",
    invitedAt: "2025-01-25T10:00:00+05:30",
  },
];
