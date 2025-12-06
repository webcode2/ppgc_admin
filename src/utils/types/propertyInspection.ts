export type InspectionStatus = "Inspected" | "Upcoming";

export interface InspectionItem {
    name: string;
    property: string;
    inspectionDate: string;
    inspectionTime: string;
    callNumber: string;
    status: InspectionStatus;
}