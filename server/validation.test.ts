import { insertProspectSchema } from "@shared/schema";

describe("insertProspectSchema validation", () => {
  const validBase = {
    companyName: "Acme Corp",
    roleTitle: "Engineer",
    status: "Bookmarked" as const,
    interestLevel: "Medium" as const,
  };

  describe("required fields", () => {
    it("accepts valid minimal input", () => {
      const result = insertProspectSchema.safeParse(validBase);
      expect(result.success).toBe(true);
    });

    it("rejects missing companyName", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, companyName: "" });
      expect(result.success).toBe(false);
    });

    it("rejects missing roleTitle", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, roleTitle: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("status validation", () => {
    it("accepts valid status", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, status: "Applied" });
      expect(result.success).toBe(true);
    });

    it("rejects invalid status", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, status: "InvalidStatus" });
      expect(result.success).toBe(false);
    });
  });

  describe("interestLevel validation", () => {
    it("accepts valid interest level", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, interestLevel: "High" });
      expect(result.success).toBe(true);
    });

    it("rejects invalid interest level", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, interestLevel: "VeryHigh" });
      expect(result.success).toBe(false);
    });
  });

  describe("salary validation", () => {
    it("accepts null salary", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, salary: null });
      expect(result.success).toBe(true);
    });

    it("accepts undefined salary", () => {
      const result = insertProspectSchema.safeParse({ ...validBase });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.salary).toBeUndefined();
      }
    });

    it("accepts valid integer salary", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, salary: 120000 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.salary).toBe(120000);
      }
    });

    it("rejects negative salary", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, salary: -5000 });
      expect(result.success).toBe(false);
    });

    it("rejects non-integer salary", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, salary: 50000.5 });
      expect(result.success).toBe(false);
    });

    it("rejects string salary", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, salary: "100000" });
      expect(result.success).toBe(false);
    });
  });

  describe("contactName validation", () => {
    it("accepts null contactName", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, contactName: null });
      expect(result.success).toBe(true);
    });

    it("accepts empty string contactName", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, contactName: "" });
      expect(result.success).toBe(true);
    });

    it("accepts valid contactName", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, contactName: "Jane Smith" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.contactName).toBe("Jane Smith");
      }
    });

    it("accepts undefined contactName", () => {
      const result = insertProspectSchema.safeParse({ ...validBase });
      expect(result.success).toBe(true);
    });
  });

  describe("contactEmail validation", () => {
    it("accepts null contactEmail", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, contactEmail: null });
      expect(result.success).toBe(true);
    });

    it("accepts empty string contactEmail", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, contactEmail: "" });
      expect(result.success).toBe(true);
    });

    it("accepts valid email address", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, contactEmail: "jane@company.com" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.contactEmail).toBe("jane@company.com");
      }
    });

    it("rejects invalid email address", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, contactEmail: "not-an-email" });
      expect(result.success).toBe(false);
    });

    it("rejects email without domain", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, contactEmail: "user@" });
      expect(result.success).toBe(false);
    });

    it("rejects email without @ symbol", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, contactEmail: "userdomain.com" });
      expect(result.success).toBe(false);
    });

    it("accepts undefined contactEmail", () => {
      const result = insertProspectSchema.safeParse({ ...validBase });
      expect(result.success).toBe(true);
    });
  });

  describe("jobUrl validation", () => {
    it("accepts null jobUrl", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, jobUrl: null });
      expect(result.success).toBe(true);
    });

    it("accepts valid URL string", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, jobUrl: "https://example.com/job" });
      expect(result.success).toBe(true);
    });

    it("accepts empty string jobUrl", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, jobUrl: "" });
      expect(result.success).toBe(true);
    });
  });

  describe("notes validation", () => {
    it("accepts null notes", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, notes: null });
      expect(result.success).toBe(true);
    });

    it("accepts string notes", () => {
      const result = insertProspectSchema.safeParse({ ...validBase, notes: "Great opportunity" });
      expect(result.success).toBe(true);
    });
  });

  describe("full prospect with all fields", () => {
    it("accepts a fully populated prospect", () => {
      const result = insertProspectSchema.safeParse({
        ...validBase,
        jobUrl: "https://example.com/job",
        salary: 150000,
        contactName: "John Doe",
        contactEmail: "john@example.com",
        notes: "Referred by a friend",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.companyName).toBe("Acme Corp");
        expect(result.data.salary).toBe(150000);
        expect(result.data.contactName).toBe("John Doe");
        expect(result.data.contactEmail).toBe("john@example.com");
      }
    });

    it("accepts a prospect with all optional fields empty/null", () => {
      const result = insertProspectSchema.safeParse({
        ...validBase,
        jobUrl: null,
        salary: null,
        contactName: null,
        contactEmail: null,
        notes: null,
      });
      expect(result.success).toBe(true);
    });
  });
});
