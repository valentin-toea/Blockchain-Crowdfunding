interface UserProfile {
    id?: string;
    firstName: string;
    lastName: string;
    wallet: string;
    userId: string;
    public: boolean;
    description: string;
    address: {country: string, residence: string} | null;
    email: string;
    companyName: string;
    hasCompany: boolean;
    companyEmail:string;
    phone: string;
    companyDescription:string;
}