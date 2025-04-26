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
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching results:', error);
      return;
    }

    const cleanedData = data?.map(item => ({
      ...item,
      incorrect_answers: parseIncorrectAnswers(item.incorrect_answers),
      percentage: parseFloat(item.percentage.toFixed(2))
    })) || [];

    setResults(cleanedData);
  };

  const parseIncorrectAnswers = (answers: any): IncorrectAnswer[] => {
    if (!answers) return [];
    
    try {
      if (typeof answers === 'string') {
        const parsed = JSON.parse(answers);
        return Array.isArray(parsed) ? parsed : [parsed];
      }
      return Array.isArray(answers) ? answers : [answers];
    } catch (e) {
      console.error('Error parsing incorrect answers:', answers, e);
      return [];
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error('Invalid date');
      
      return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
        '-',
        String(date.getSeconds()).padStart(2, '0'),
        String(date.getMinutes()).padStart(2, '0'),
        String(date.getHours()).padStart(2, '0')
      ].join('');
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return 'Date-Invalide';
    }
  };

  const generatePDF = (result: QuizResult) => {
    try {
      const doc = new jsPDF();
      const formattedDate = formatDate(result.created_at);

      // Configuration des polices
      doc.setFont('helvetica'); // Police par défaut
      
      // 1. En-tête du document
      doc.setFontSize(20);
      doc.setFont(helvetica , 'bold');
      doc.setTextColor(33, 33, 33); // Noir
      doc.text('RESULTATS DU QUIZ', 20, 20);

      // 2. Informations utilisateur
      doc.setFontSize(12);
      doc.setFont(helvetica , 'normal');
      let yPosition = 40;
      
      const userInfo = [
        `Nom: ${result.display_name || 'Non spécifié'}`,
        `Email: ${result.user_email || 'Non spécifié'}`,
        `Score: ${result.score || 0}/${result.total_questions || 0}`,
        `Pourcentage: ${result.percentage || 0}%`,
        `Date: ${formattedDate}`
      ];

      userInfo.forEach(info => {
        doc.text(info, 20, yPosition);
        yPosition += 10;
      });

      // 3. Questions incorrectes
      if (result.incorrect_answers && result.incorrect_answers.length > 0) {
        doc.setFontSize(16);
        doc.setFont(helvetica , 'bold');
        doc.text('Questions mal répondues:', 20, yPosition + 10);
        
        // Préparation des données du tableau
        const tableData = result.incorrect_answers
          .filter(item => item)
          .map(item => [
            item.question || 'Question non disponible',
            item.user_answer || 'Non répondue',
            item.correct_answer || 'Réponse non disponible'
          ]);

        // Police monospace pour le tableau
        doc.setFont('helvetica ');
        
        autoTable(doc, {
          head: [['Question', 'Votre réponse', 'Bonne réponse']],
          body: tableData,
          startY: yPosition + 20,
          styles: { 
            font: 'helvetica ',
            fontSize: 10,
            cellPadding: 3,
            overflow: 'linebreak',
            textColor: [0, 0, 0] // Noir
          },
          headStyles: { 
            fillColor: [255, 0, 10], // Bleu
            textColor: 255, // Blanc
            fontStyle: 'bold'
          },
          alternateRowStyles: { 
            fillColor: [245, 245, 245] // Gris clair
          },
          margin: { horizontal: 15 }
        });
      }

      // 4. Pied de page
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.text('Quiz karoka - ' + new Date().toLocaleDateString(), 20, pageHeight - 10);

      // 5. Sauvegarde
      const filename = `quiz-result-${result.display_name || 'anonymous'}-${formattedDate}.pdf`
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-.]/g, '');

      doc.save(filename);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert(`Erreur lors de la génération du PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
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
              {results.map((result) => (
                <TableRow key={result.id} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-4 flex items-center gap-2">
                    <UserAvatar name={result.display_name} />
                    <span>{result.display_name || 'Anonyme'}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4">{result.user_email || 'Non spécifié'}</TableCell>
                  <TableCell className="px-6 py-4">{result.score || 0}/{result.total_questions || 0}</TableCell>
                  <TableCell className="px-6 py-4">{result.percentage?.toFixed(2) || 0}%</TableCell>
                  <TableCell className="px-6 py-4">{formatDate(result.created_at)}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Button 
                      variant="outline" 
                      onClick={() => generatePDF(result)}
                      className="flex items-center gap-2"
                    >
                      <Download size={16} />
                      <span></span>
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
