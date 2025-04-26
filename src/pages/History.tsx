import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download } from 'lucide-react';
import { UserAvatar } from '@/components/UserAvatar';

type IncorrectAnswer = {
  question?: string;
  user_answer?: string;
  correct_answer?: string;
};

type QuizResult = {
  id: string;
  display_name: string;
  user_email: string;
  score: number;
  total_questions: number;
  percentage: number;
  created_at: string;
  incorrect_answers: IncorrectAnswer[] | null;
};

export default function History() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const { data, error } = await supabase
      .from('quiz_results')
      .select(`
        id,
        display_name,
        user_email,
        score,
        total_questions,
        percentage,
        created_at,
        incorrect_answers
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching results:', error);
      return;
    }

    const cleanedData = data?.map(item => ({
      ...item,
      incorrect_answers: parseIncorrectAnswers(item.incorrect_answers),
      percentage: parseFloat(item.percentage.toFixed(2)),
    })) || [];

    setResults(cleanedData);
  };

  const parseIncorrectAnswers = (answers: any): IncorrectAnswer[] => {
    if (!answers) return [];

    try {
      let parsed = typeof answers === 'string' ? JSON.parse(answers) : answers;
      if (!Array.isArray(parsed)) parsed = [parsed];
      return parsed.filter((it: any) => {
        const ua = it.user_answer?.toString().toLowerCase().trim();
        const ca = it.correct_answer?.toString().toLowerCase().trim();
        return ua !== ca;
      });
    } catch (e) {
      console.error('Error parsing incorrect_answers:', answers, e);
      return [];
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) throw new Error('Invalid date');
      const YYYY = d.getFullYear();
      const MM = String(d.getMonth() + 1).padStart(2, '0');
      const DD = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      return `${YYYY}${MM}${DD}-${hh}${mm}${ss}`;
    } catch {
      return 'Date-Invalide';
    }
  };

  const generatePDF = (result: QuizResult) => {
    if (typeof window === 'undefined') {
      console.error('PDF generation disabled on server side');
      return;
    }

    try {
      const doc = new jsPDF();
      const formattedDate = formatDate(result.created_at);

      // Titre
      doc.setFont('helvetica');
      doc.setFontSize(20);
      doc.setFont(undefined, 'bolditalic');
      doc.setTextColor(118, 2, 10);
      doc.text('RESULTATS DU QUIZ', 20, 20);

      // Infos utilisateur
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      let y = 40;
      const userInfo = [
        { label: 'Nom', value: result.display_name || 'Non spécifié' },
        { label: 'Email', value: result.user_email || 'Non spécifié' },
        { label: 'Score', value: `${result.score}/${result.total_questions}` },
        { label: 'Pourcentage', value: `${result.percentage.toFixed(2)}%` },
        { label: 'Date', value: formattedDate },
      ];
      userInfo.forEach(info => {
        doc.setTextColor(118, 2, 10);
        doc.text(`${info.label}:`, 20, y);
        doc.setTextColor(0, 0, 0);
        doc.text(info.value, 60, y);
        y += 10;
      });

      // Mauvaises réponses
      if (result.incorrect_answers && result.incorrect_answers.length > 0) {
        y += 10;
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(118, 2, 10);
        doc.text('Questions mal répondues:', 20, y);

        const body = result.incorrect_answers.map(it => [
          it.question || '—',
          it.user_answer || '—',
          it.correct_answer || '—',
        ]);
        autoTable(doc, {
          head: [['Question', 'Votre réponse', 'Bonne réponse']],
          body,
          startY: y + 10,
          styles: { fontSize: 10, cellPadding: 3, overflow: 'linebreak' },
          headStyles: { fillColor: [118, 2, 10], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 245, 245] },
        });
      }

      // Pied de page
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      const ph = doc.internal.pageSize.getHeight();
      doc.text(`Quiz Karoka – ${new Date().toLocaleDateString()}`, 20, ph - 10);

      // Sauvegarde dans le try !
      const fname = `quiz-result-${(result.display_name || 'anon')}-${formattedDate}.pdf`
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-_.]/g, '');
      doc.save(fname);

    } catch (err) {
      console.error('PDF generation error:', err);
      // Pas d'alert() côté build/Vercel
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Historique des Quiz</h1>
          <Button variant="outline" onClick={() => navigate('/')}>Retour</Button>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-6 py-3">Utilisateurs</TableHead>
                <TableHead className="px-6 py-3">Emails</TableHead>
                <TableHead className="px-6 py-3">Scores</TableHead>
                <TableHead className="px-6 py-3">Pourcentages</TableHead>
                <TableHead className="px-6 py-3">Dates</TableHead>
                <TableHead className="px-6 py-3">PDF</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map(result => (
                <TableRow key={result.id} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-4 flex items-center gap-2">
                    <UserAvatar name={result.display_name} />
                    {result.display_name}
                  </TableCell>
                  <TableCell className="px-6 py-4">{result.user_email}</TableCell>
                  <TableCell className="px-6 py-4">{result.score}/{result.total_questions}</TableCell>
                  <TableCell className="px-6 py-4">{result.percentage.toFixed(2)}%</TableCell>
                  <TableCell className="px-6 py-4">{formatDate(result.created_at)}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Button onClick={() => generatePDF(result)} className="flex items-center gap-2">
                      <Download size={16}/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
