"use client";

export function DeleteAccountButton({ action }: { action: () => void }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        style={{
          background: "none",
          border: "1px solid var(--gray-300)",
          color: "var(--gray-500)",
          padding: "10px 20px",
          borderRadius: "6px",
          fontSize: "0.85rem",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Delete my account
      </button>
    </form>
  );
}
