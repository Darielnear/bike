import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      q: "Quali sono i tempi di consegna?",
      a: "Le nostre e-bike vengono consegnate in tutta Italia entro 3-5 giorni lavorativi tramite corrieri specializzati."
    },
    {
      q: "Come funziona il pagamento tramite PostePay/BBVA?",
      a: "Una volta completato l'ordine, riceverai le coordinate IBAN. Potrai effettuare il pagamento tramite bonifico o ricarica PostePay. L'ordine verrà elaborato non appena riceveremo la conferma del pagamento."
    },
    {
      q: "Le e-bike arrivano già montate?",
      a: "Sì, le e-bike arrivano montate al 95%. Sarà necessario solo raddrizzare il manubrio e montare i pedali. Includiamo un kit di attrezzi e una guida rapida."
    },
    {
      q: "Posso usufruire del Bonus Bici?",
      a: "Cicli Volante rilascia fattura valida per tutte le agevolazioni fiscali e bonus governativi vigenti al momento dell'acquisto."
    },
    {
      q: "Cosa copre la garanzia?",
      a: "La garanzia copre difetti di fabbricazione del telaio (5 anni) e dei componenti elettrici come motore e batteria (2 anni)."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-display font-bold mb-12 text-center uppercase tracking-tighter">Domande Frequenti (FAQ)</h1>
      
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left font-bold">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
