import heroImage from "@/assets/rakta-hero-blood-donation.jpg";
import emergencyImage from "@/assets/rakta-hospital-emergency.jpg";
import handsImage from "@/assets/rakta-helping-hands.jpg";
import teamImage from "@/assets/rakta-medical-team.jpg";

export const images = { heroImage, emergencyImage, handsImage, teamImage };

export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export const sampleDonors = [
  { id: "1", name: "A••••", group: "O+", area: "Patna Central", status: "Available", photo: teamImage },
  { id: "2", name: "S••••", group: "A-", area: "Kankarbagh", status: "Available", photo: handsImage },
  { id: "3", name: "R••••", group: "B+", area: "Bailey Road", status: "Not Available", photo: emergencyImage },
  { id: "4", name: "N••••", group: "AB+", area: "Boring Road", status: "Available", photo: heroImage },
  { id: "5", name: "K••••", group: "O-", area: "Danapur", status: "Available", photo: teamImage },
  { id: "6", name: "P••••", group: "A+", area: "Rajendra Nagar", status: "Available", photo: handsImage },
];

export const stats = [
  { label: "Registered Donors", value: "12,840" },
  { label: "Successful Donations", value: "8,219" },
  { label: "Avg. Match Time", value: "07 min" },
];

export const faqs = [
  ["Who can donate?", "Most healthy adults aged 18–65 can donate after a quick medical screening."],
  ["Is blood donation safe?", "Yes. Sterile single-use equipment and trained medical staff keep the process safe."],
  ["How often can I donate?", "Whole blood donors can usually donate every 3 months after medical approval."],
];
