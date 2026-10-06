import { PharmacyMedicine } from "generated/prisma/client"

export class CreateMedicineDto {
    name: string
    dosage?: string
    description?: string
}
