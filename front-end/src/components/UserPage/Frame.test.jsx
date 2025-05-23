import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Frame from "./Frame";

describe("Frame", () => {
  it("renders the main dashboard components", () => {
    render(<Frame />);

    // Check for main headings
    expect(screen.getByText("PDAM Monitor")).toBeInTheDocument();
    expect(screen.getByText("Aktivitas Terkini")).toBeInTheDocument();
    expect(screen.getByText("Jadwal Maintenance")).toBeInTheDocument();
    expect(screen.getByText("Notifikasi")).toBeInTheDocument();

    // Check for metric cards
    expect(screen.getByText("Konsumsi Air")).toBeInTheDocument();
    expect(screen.getByText("Kualitas Air")).toBeInTheDocument();
    expect(screen.getByText("Tekanan Air")).toBeInTheDocument();

    // Check for footer content
    expect(
      screen.getByText("© 2025 PDAM Monitoring System"),
    ).toBeInTheDocument();
    expect(screen.getByText("Bantuan")).toBeInTheDocument();
    expect(screen.getByText("Pengaturan")).toBeInTheDocument();
  });
});
