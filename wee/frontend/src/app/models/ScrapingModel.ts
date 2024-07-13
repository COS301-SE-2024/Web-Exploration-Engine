// interface Robots {
//     baseUrl: string;
//     allowedPaths: string[];
//     disallowedPaths: string[];
//     isUrlScrapable: boolean;
//     isBaseUrlAllowed: boolean;
// }

// interface Metadata {
//     title: string;
//     description: string;
//     keywords: string;
//     ogTitle: string;
//     ogDescription: string;
//     ogImage: string;
// }

// interface IndustryClassification {
//     metadataClass: {
//         label: string;
//         score: number;
//     };
//     domainClass: {
//         label: string;
//         score: number;
//     };
// }

// export default interface Scraping {
//     url: string;
//     domainStatus: string;
//     robots: Robots;
//     metadata: Metadata;
//     industryClassification: IndustryClassification;
//     logo: string;
//     images: string[];
//     slogan: string;
//     time:number;
// }