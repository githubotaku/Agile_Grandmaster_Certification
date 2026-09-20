import "server-only";
import { prisma } from "@/lib/prisma";
import { APPLICATION_STATUS, CERT_ORG_NAME, CERT_TITLE } from "@/lib/constants";

const CERTIFICATE_COUNTER_ID = "certificate";

export function formatCertificateNumber(sequence: number): string {
  return sequence.toString().padStart(8, "0");
}

/**
 * Approves a pending application and issues the next sequential certificate
 * number (starting at 00000001) in a single transaction.
 */
export async function approveApplicationAndIssueCertificate(
  applicationId: string,
  adminId: string,
) {
  return prisma.$transaction(async (tx) => {
    const application = await tx.application.findUniqueOrThrow({
      where: { id: applicationId },
    });

    const counter = await tx.counter.upsert({
      where: { id: CERTIFICATE_COUNTER_ID },
      create: { id: CERTIFICATE_COUNTER_ID, value: 1 },
      update: { value: { increment: 1 } },
    });

    await tx.application.update({
      where: { id: applicationId },
      data: {
        status: APPLICATION_STATUS.APPROVED,
        reviewedAt: new Date(),
        reviewedById: adminId,
        rejectionReason: null,
      },
    });

    const certificate = await tx.certificate.create({
      data: {
        number: formatCertificateNumber(counter.value),
        sequence: counter.value,
        userId: application.userId,
        applicationId: application.id,
        issuedById: adminId,
      },
    });

    return certificate;
  });
}

export async function rejectApplication(
  applicationId: string,
  adminId: string,
  reason: string,
) {
  return prisma.application.update({
    where: { id: applicationId },
    data: {
      status: APPLICATION_STATUS.REJECTED,
      reviewedAt: new Date(),
      reviewedById: adminId,
      rejectionReason: reason,
    },
  });
}

export function buildCertificateUrl(certificateNumber: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/certificate/${certificateNumber}`;
}

export function buildLinkedInAddToProfileUrl(params: {
  certificateNumber: string;
  issuedAt: Date;
}): string {
  const url = new URL("https://www.linkedin.com/profile/add");
  url.searchParams.set("startTask", "CERTIFICATION_NAME");
  url.searchParams.set("name", CERT_TITLE);
  url.searchParams.set("organizationName", CERT_ORG_NAME);
  url.searchParams.set("issueYear", String(params.issuedAt.getFullYear()));
  url.searchParams.set("issueMonth", String(params.issuedAt.getMonth() + 1));
  url.searchParams.set("certUrl", buildCertificateUrl(params.certificateNumber));
  url.searchParams.set("certId", params.certificateNumber);
  return url.toString();
}
