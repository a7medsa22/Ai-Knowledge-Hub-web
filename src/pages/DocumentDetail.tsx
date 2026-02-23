import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiResultCard } from "@/components/ai/AiResultCard";

const mockDocument = {
  title: "Transformer Architecture Deep Dive",
  content: `The Transformer architecture, introduced in the seminal paper "Attention Is All You Need" by Vaswani et al. (2017), has fundamentally reshaped natural language processing and beyond.

Unlike recurrent neural networks (RNNs) that process sequences step-by-step, Transformers leverage a mechanism called self-attention to process all positions in a sequence simultaneously. This parallelism enables significantly faster training on modern hardware.

The core components of a Transformer include:

• Multi-Head Attention: Rather than computing a single attention function, the model runs multiple attention operations in parallel ("heads"), each learning different aspects of the relationships between tokens.

• Positional Encoding: Since the architecture has no inherent notion of order, positional information is injected via sinusoidal functions or learned embeddings added to the input representations.

• Feed-Forward Networks: Each layer contains a position-wise feed-forward network applied independently to each position, typically consisting of two linear transformations with a ReLU activation in between.

• Layer Normalization & Residual Connections: These stabilize training and enable deeper architectures by ensuring gradients flow effectively through the network.

The encoder-decoder structure of the original Transformer has since been adapted into encoder-only models (BERT), decoder-only models (GPT), and encoder-decoder models (T5), each suited for different tasks.

The impact of this architecture cannot be overstated — it serves as the foundation for virtually all modern large language models, including GPT-4, Claude, Gemini, and LLaMA.`,
};

const mockSummaries: Record<string, string> = {
  summarize: `The Transformer architecture (Vaswani et al., 2017) revolutionized NLP by replacing sequential RNN processing with parallel self-attention.

Key components:
• Multi-Head Attention for parallel relationship learning
• Positional Encoding for sequence order
• Feed-Forward Networks per position
• Layer Norm & Residual Connections for training stability

Variants: BERT (encoder-only), GPT (decoder-only), T5 (encoder-decoder). Foundation for all modern LLMs.`,
  question: `Based on the document, Transformers achieve faster training through self-attention, which processes all sequence positions simultaneously instead of the step-by-step approach of RNNs. This parallelism maps efficiently to GPU hardware.`,
  extract: `Key Points:
• Self-attention enables parallel sequence processing
• Multi-head attention learns diverse token relationships
• Positional encoding compensates for lack of inherent order
• Three main variants: encoder-only, decoder-only, encoder-decoder
• Foundation architecture for GPT-4, Claude, Gemini, LLaMA`,
};

const DocumentDetail = () => {
  const { id } = useParams();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAction = (action: string) => {
    setLoading(true);
    setActiveAction(null);
    setTimeout(() => {
      setActiveAction(action);
      setLoading(false);
    }, 800);
  };

  const actionLabels: Record<string, string> = {
    summarize: "AI Summary",
    question: "AI Answer",
    extract: "Key Points",
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <Link to="/documents" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Documents
      </Link>

      {/* AI Actions bar */}
      <div className="sticky top-0 z-10 -mx-6 px-6 py-3 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "summarize", label: "Summarize" },
            { key: "question", label: "Ask Question" },
            { key: "extract", label: "Extract Key Points" },
          ].map((action) => (
            <Button
              key={action.key}
              variant="secondary"
              className="rounded-xl gap-1.5"
              onClick={() => handleAction(action.key)}
              disabled={loading}
            >
              <Brain className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <article>
        <h1 className="text-3xl font-bold mb-6">{mockDocument.title}</h1>
        <div className="text-base leading-[1.6] text-muted-foreground whitespace-pre-line max-w-[720px]">
          {mockDocument.content}
        </div>
      </article>

      {/* AI Result */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:200ms]" />
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:400ms]" />
          </div>
          AI is thinking...
        </div>
      )}

      {activeAction && (
        <AiResultCard
          title={actionLabels[activeAction]}
          content={mockSummaries[activeAction]}
          visible
        />
      )}
    </div>
  );
};

export default DocumentDetail;
