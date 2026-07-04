import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";
import SectionHeading from "@/components/ui/SectionHeading";

const messages = [
  { role: "assistant", text: "Welcome to DocMind Chat! Ask me anything about your uploaded documents." },
  { role: "user", text: "What are the key takeaways from the latest sales report?" },
  { role: "assistant", text: "The report highlights strong quarter-over-quarter growth, improving margins, and a focus on enterprise accounts." },
];

export default function ChatPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        title="Document chat"
        subtitle="Ask questions in natural language and receive answers based on your uploaded files."
      />

      <Panel title="Chat conversation" description="Use the chat interface to get document-aware responses." className="space-y-6">
        <div className="space-y-4 rounded-[2rem] border border-slate-800 bg-slate-950/90 p-6">
          {messages.map((message, index) => (
            <div key={index} className={`rounded-3xl p-5 ${message.role === "assistant" ? "bg-slate-900/80" : "bg-slate-800/70"}`}>
              <p className="text-sm font-semibold text-slate-300">{message.role === "assistant" ? "DocMind AI" : "You"}</p>
              <p className="mt-3 text-sm leading-7 text-slate-200">{message.text}</p>
            </div>
          ))}
        </div>

        <form className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <textarea
            className="min-h-[140px] w-full rounded-3xl border border-slate-800 bg-slate-950/90 p-4 text-sm text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Type your question here..."
            aria-label="Chat message"
          />
          <Button type="submit" className="self-end">Send</Button>
        </form>
      </Panel>
    </div>
  );
}
