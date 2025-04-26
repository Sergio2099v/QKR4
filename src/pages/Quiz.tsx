import { useState } from "react";
import { Button } from "@/components/ui/button";
import {  Card, CardContent,  CardDescription,  CardFooter,  CardHeader,  CardTitle,} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const questions = [
{id:1,question: "Quel est le principal objectif du référentiel concernant le domaine d'application des extincteurs?",options: ["Définir les exigences pour la fabrication des extincteurs.", "Définir les exigences pour la conception, la réalisation et la maintenance des installations d'extincteurs.", "Établir les tarifs de location des extincteurs portatifs.", "Former le personnel à l'utilisation des extincteurs en entreprise."],correct: 1},
{id:2,question: "Le référentiel s'applique-t-il uniquement aux bâtiments industriels?",options: ["Oui, car les risques d'incendie y sont plus élevés.", "Oui, car ce sont les seuls lieux mentionnés explicitement.", "Non, il concerne principalement les établissements recevant du public (ERP).", "Non, il concerne des surfaces diverses telles que les locaux industriels, agricoles, commerciaux ou administratifs, ainsi que certaines parties d'habitation."],correct: 3},
{id:3,question: "Quels types de surfaces couvertes sont spécifiquement mentionnés dans le domaine d'application?",options: ["Uniquement les parkings souterrains et les zones de stockage de produits chimiques.", "Les théâtres, cinémas et hôpitaux.", "Les locaux techniques, les parcs de stationnement couverts, les dégagements, halls d'entrée, etc.", "Les habitations individuelles de plus de trois étages."],correct: 2},
{id:4,question: "Les installations particulières mentionnées dans le domaine d'application concernent principalement?",options: ["Les installations particulières visées au § 2.3.", "Les habitations individuelles isolées.", "Les véhicules de transport de marchandises dangereuses.", "Les chantiers de construction de moins de 50 personnes."],correct: 0},
{id:5,question: "Quelle information importante est précisée concernant le personnel à la fin de la section sur le domaine d'application?",options: ["Le personnel doit vérifier les extincteurs quotidiennement.", "Le personnel doit choisir le type d'extincteur adapté à chaque risque.", "Note : le personnel doit être formé à la manœuvre des extincteurs!", "Note : un registre de sécurité doit être tenu à jour par le personnel."],correct: 2},
{id:6,question: "Quelle est la fonction principale d'une installation d'extincteurs selon le texte?",options: ["Éteindre complètement un incendie de grande ampleur.", "Remplacer les systèmes automatiques de détection et d'extinction.", "Être un moyen de première intervention dans la lutte contre l'incendie.", "Garantir l'évacuation rapide des occupants d'un bâtiment."],correct: 2},
{id:7,question: "Dans quelle situation un extincteur est-il particulièrement efficace?",options: ["Lorsque l'incendie s'est propagé à plusieurs pièces.", "Lorsque les flammes atteignent une hauteur de plus de 3 mètres.", "Lorsque les matériaux en combustion sont des liquides inflammables.", "Sur un foyer naissant."],correct: 3},
{id:8,question: "Pourquoi le temps d'utilisation d'un extincteur est-il limité?",options: ["En raison de la complexité de sa manipulation.", "À cause de la réglementation en vigueur concernant la durée d'intervention.", "En raison de la quantité limitée d'agent extincteur.", "Pour éviter une utilisation excessive par le personnel non formé."],correct: 2},
{id:9,question: "La mise en place d'une installation d'extincteurs dépend-elle d'autres moyens de prévention et de lutte contre l'incendie?",options: ["Non, elle est indépendante de tout autre moyen.", "Oui, elle doit être précédée de l'installation de détecteurs de fumée.", "Oui, elle est obligatoire uniquement si un système d'alarme incendie est présent.", "Oui, le nombre d'extincteurs dépend des autres moyens de lutte disponibles."],correct: 0},
{id:10,question: "Selon le référentiel APSAD R4, une installation d'extincteurs est considérée comme?",options: ["Le seul moyen de secours obligatoire dans tous les types de bâtiments.", "Un moyen de prévention primaire contre le risque d'incendie.", "L'un des moyens de secours prévus par le référentiel APSAD R4 Maîtrise du risque incendie.", "Un équipement devant être vérifié annuellement par un organisme certifié."],correct: 2},
{id:11,question: "Que désigne le terme <<Agent extincteur>>?",options: ["L'ensemble du dispositif de l'extincteur.", "La personne formée à l'utilisation de l'extincteur.", "La substance contenue dans l'extincteur et dont l'action provoque l'extinction d'un incendie.", "Le mécanisme de déclenchement de l'extincteur."],correct: 2},
{id:12,question: "Qu'est-ce qu'un <<Extincteur portatif>> selon la terminologie?",options: ["Un extincteur monté sur roues et facilement déplaçable.", "Un extincteur de grande capacité destiné à un usage professionnel.", "Un extincteur conçu pour être porté et utilisé à la main et qui, en ordre de fonctionnement, a une masse inférieure ou égale à 20 kg.", "Un extincteur à usage unique ne nécessitant pas de recharge."],correct: 2},
{id:13,question: "Que signifie <<Capacité>> d'un extincteur?",options: ["La pression interne maximale que peut supporter l'appareil.", "La masse (ou volume) d'agent extincteur pour laquelle l'extincteur est certifié.", "La durée minimale de fonctionnement de l'extincteur lors de son utilisation.", "La hauteur maximale à laquelle l'agent extincteur peut être projeté."],correct: 1},
{id:14,question: "Quelle est la caractéristique principale d'un <<Extincteur mobile>>?",options: ["Extincteur conçu pour être transporté et actionné manuellement et dont la masse totale supérieure à 20 kg. Un extincteur mobile est monté sur roues.", "Extincteur pouvant être déclenché à distance grâce à un système de télécommande.", "Extincteur spécialement conçu pour éteindre les feux de liquides polaires.", "Extincteur dont la durée de vie est supérieure à celle d'un extincteur portatif."],correct: 0},
{id:15,question: "Que décrit la <<Classe de feu>>?",options: ["Le type d'agent extincteur contenu dans l'appareil.", "La température maximale à laquelle l'extincteur peut être stocké.", "La nature du combustible en feu (classe A : feux de matériaux solides, classe B : feux de liquides ou solides liquéfiables, etc.).", "Le niveau de certification de l'extincteur selon les normes européennes."],correct: 2},{id:16,question: "Quels sont les principaux agents extincteurs mentionnés pour la classe A de feu?",options: ["Poudre BC et dioxyde de carbone (CO2).", "Uniquement l'eau pulvérisée avec additif.", "Eau pulvérisée, eau pulvérisée avec additif, mousse.", "Les poudres pour feux de métaux (classe D)."],correct: 2},
{id:17,question: "Pour quel type de feu la poudre ABC est-elle particulièrement efficace?",options: ["Feux de liquides inflammables uniquement.", "Feux de gaz uniquement.", "Feux de solides, de liquides et de gaz.", "Feux d'huiles et de graisses de cuisson (classe F)."],correct: 2},
{id:18,question: "Dans quelles situations l'utilisation d'extincteurs à eau est-elle déconseillée?",options: ["En présence de matériaux produisant des braises.", "En présence de risques électriques.", "Dans les zones où la température ambiante est élevée.", "Sur les feux se propageant verticalement."],correct: 1},
{id:19,question: "Quel avantage spécifique présente l'extincteur à dioxyde de carbone (CO2)?",options: ["Il laisse un résidu abondant permettant de prévenir la réinflammation.", "Il est propre et ne laisse pas de résidu après utilisation.", "Il est efficace sur une large gamme de classes de feu, y compris les feux de métaux.", "Il a une longue portée de jet, permettant d'intervenir à distance."],correct: 1},
{id:20,question: "Selon le référentiel, quel critère doit être pris en compte pour le choix de l'agent extincteur en fonction du risque?",options: ["La couleur de l'extincteur pour une identification rapide.", "Le coût d'achat et de maintenance de l'appareil.", "La nature des feux susceptibles de se déclarer dans les zones à protéger.", "La facilité de manipulation de l'extincteur par le personnel non formé."],correct: 2},
{id:21,question: "La détermination du nombre d'extincteurs pour la protection générale est basée principalement sur?",options: ["Le nombre d'employés présents dans les locaux.", "La hauteur sous plafond des bâtiments.", "La surface des zones à protéger et le niveau de risque.", "La proximité des points d'eau et des hydrants incendie."],correct: 2},
{id:22,question: "Quels sont les deux types de risques considérés pour la détermination du nombre d'extincteurs?",options: ["Risque faible et risque élevé.", "Risques généraux et risques particuliers.", "Risques internes et risques externes.", "Risques liés à l'activité et risques liés au bâtiment."],correct: 1},
{id:23,question: "Selon le texte, la protection complémentaire vise à?",options: ["Doubler le nombre d'extincteurs de la protection générale.", "Protéger les zones non couvertes par la protection générale.", "Protéger des risques spécifiques et localisés.", "Utiliser des extincteurs de types différents de ceux de la protection générale."],correct: 2},
{id:24,question: "Quelle est la distance maximale à parcourir pour atteindre un extincteur de protection générale dans les zones à risque courant?",options: ["5 mètres.", "10 mètres.", "15 mètres.", "20 mètres."],correct: 1},
{id:25,question: "Comment est déterminée la dotation minimale d'extincteurs portatifs pour une unité de base?",options: ["Elle est fixée forfaitairement à un extincteur par 100 m².", "Elle est définie en fonction du type de risque (faible, courant, élevé).", "Elle dépend du type d'activité exercée dans les locaux.", "Elle est préconisée par l'assureur de l'établissement."],correct: 1},
{id:26,question: "La protection d'installations particulières concerne notamment?",options: ["Les bureaux paysagers de plus de 50 personnes.", "Les couloirs et les escaliers de secours.", "Les locaux à risques importants tels que les chaufferies, les cuisines collectives, les locaux électriques.", "Les zones de stockage de matériaux non combustibles."],correct: 2},
{id:27,question: "Pour les stockages extérieurs de liquides ou de gaz inflammables, la protection est généralement assurée par?",options: ["Des extincteurs à eau pulvérisée de grande capacité.", "Des extincteurs adaptés aux risques spécifiques concernés, en nombre déterminé par l'analyse du risque.", "Des extincteurs automatiques à déclenchement thermique.", "Uniquement des hydrants incendie situés à proximité."],correct: 1},
{id:28,question: "Concernant les armoires électriques, quel type d'extincteur est souvent recommandé?",options: ["Extincteur à eau avec additif.", "Extincteur à mousse.", "Extincteur à dioxyde de carbone (CO2) ou à poudre.", "Extincteur à jet pulsé."],correct: 2},
{id:29,question: "Pour les locaux contenant des matériels électriques sous tension supérieure à 1000 V, une des règles à suivre est?",options: ["Les extincteurs utilisés doivent être adaptés au risque électrique.", "L'installation d'extincteurs est facultative si le local est verrouillé.", "La quantité d'agent extincteur doit être doublée par mesure de sécurité.", "Seuls les extincteurs mobiles sont autorisés dans ces locaux."],correct: 0},
{id:30,question: "Pour les zones de stockage en hauteur, la protection complémentaire peut nécessiter?",options: ["Des extincteurs supplémentaires en fonction de la hauteur et de la surface.", "L'installation de systèmes d'extinction automatique uniquement.", "La mise en place d'un plan d'évacuation spécifique.", "L'utilisation d'extincteurs avec une portée de jet supérieure à la normale."],correct: 0},
{id:31,question: "Où les extincteurs doivent-ils être installés de préférence?",options: ["Dans des locaux fermés à clé dont seul le responsable de la sécurité a l'accès.", "Dans les zones les moins fréquentées pour éviter toute manipulation intempestive.", "Dans des endroits visibles, facilement accessibles et à proximité des risques à protéger et des issues.", "À une hauteur supérieure à 2 mètres pour éviter qu'ils ne soient heurtés."],correct: 2},
{id:32,question: "Quelle signalisation doit accompagner l'emplacement d'un extincteur?",options: ["Uniquement une flèche directionnelle indiquant la localisation.", "Uniquement un panneau indiquant le type d'extincteur.", "Une signalisation conforme à la réglementation en vigueur, indiquant clairement la présence et le type d'extincteur.", "Aucune signalisation spécifique n'est requise si l'extincteur est de couleur rouge."],correct: 2},
{id:33,question: "Concernant la fixation des extincteurs, il est recommandé de?",options: ["Les poser directement sur le sol pour faciliter leur prise en main.", "Les fixer avec des colliers de serrage réutilisables pour un déplacement facile.", "Les fixer solidement aux supports prévus à cet effet (mur, poteau, etc.) à l'aide des accessoires appropriés.", "Les suspendre par une simple cordelette pour amortir les chocs éventuels."],correct: 2},
{id:34,question: "Quelle est la hauteur maximale recommandée pour la poignée de portage d'un extincteur portatif?",options: ["0,80 mètre du sol.", "1,50 mètre du sol.", "1,20 mètre du sol.", "1,80 mètre du sol."],correct: 2},
{id:35,question: "Les extincteurs installés à l'extérieur doivent être protégés contre?",options: ["Uniquement les fortes pluies.", "Uniquement les rayons directs du soleil.", "Les intempéries et les risques de détérioration (chocs, corrosion, etc.).", "Uniquement le vol."],correct: 2},{id:36,question: "Que doit comporter le dossier technique d'une installation d'extincteurs?",options: ["Uniquement les factures d'achat des extincteurs.", "Uniquement le plan d'évacuation des locaux.", "Les éléments justifiant la conformité de l'installation au référentiel APSAD R4, incluant notamment le plan d'implantation, le choix des appareils et les éventuelles dérogations.", "Uniquement le registre de sécurité incendie."],correct: 2},
{id:37,question: "Le dossier technique doit-il mentionner les compétences du personnel en matière de manipulation des extincteurs?",options: ["Oui, une liste nominative du personnel formé doit être incluse.", "Non, mais la formation du personnel est une exigence distincte.", "Oui, une copie des attestations de formation de chaque employé doit être jointe.", "Non, cela relève du plan de formation de l'entreprise."],correct: 1},
{id:38,question: "Quelles informations doivent figurer dans le plan d'implantation des extincteurs?",options: ["Uniquement l'emplacement des issues de secours.", "Uniquement le type et le nombre d'extincteurs installés.", "L'emplacement de chaque extincteur, son type, sa capacité et sa classe de feu.", "Uniquement la date de la dernière vérification de chaque appareil."],correct: 2},
{id:39,question: "Le dossier technique doit-il être mis à disposition de?",options: ["L'utilisateur de l'installation et des organismes de contrôle.", "Uniquement du fabricant des extincteurs.", "Uniquement des services d'incendie et de secours.", "Uniquement du personnel de maintenance interne."],correct: 0},
{id:40,question: "Selon le texte, le dossier technique doit prouver?",options: ["L'absence totale de risque d'incendie dans les locaux protégés.", "La conformité des extincteurs aux normes de fabrication en vigueur.", "Que l'installation a été conçue et réalisée conformément aux exigences du référentiel APSAD R4.", "Que le personnel a participé à des exercices d'évacuation incendie récents."],correct: 2},
{id:41,question: "Lors de la vérification de conformité, l'installateur doit notamment s'assurer que?",options: ["Tous les extincteurs sont de la même marque.", "Le personnel connaît parfaitement le numéro d'appel des pompiers.", "Le nombre, le type et l'emplacement des extincteurs sont conformes au dossier technique et aux exigences du référentiel.", "Les extincteurs sont équipés de manomètres indiquant la pression optimale."],correct: 2},
{id:42,question: "La vérification doit également porter sur?",options: ["La couleur des murs et des plafonds des locaux protégés.", "Le bon fonctionnement du système de ventilation des locaux.", "La visibilité, l'accessibilité et la signalisation des extincteurs.", "La présence d'un éclairage de secours fonctionnel dans toutes les zones."],correct: 2},
{id:43,question: "L'installateur doit-il vérifier l'état apparent des extincteurs?",options: ["Oui, il doit s'assurer qu'ils ne présentent pas de dommages visibles (corrosion, déformation, etc.).", "Non, l'état interne des extincteurs sera vérifié lors de la maintenance périodique.", "Oui, il doit procéder à un essai de fonctionnement de chaque extincteur.", "Non, cette vérification incombe à l'utilisateur de l'installation."],correct: 0},
{id:44,question: "Que doit vérifier l'installateur concernant le scellement des extincteurs?",options: ["Sa date de péremption.", "Son intégrité et sa présence (pour les appareils qui en sont équipés).", "Sa couleur et sa matière.", "Son fabricant."],correct: 1},
{id:45,question: "Après la vérification de conformité, que doit établir l'installateur?",options: ["Un devis pour la maintenance annuelle des extincteurs.", "Un plan de formation à l'usage des extincteurs pour le personnel.", "Une déclaration de conformité au référentiel APSAD R4 (document N4).", "Un registre de sécurité incendie initial."],correct: 2},
{id:46,question: "Qui est responsable de l'établissement de la déclaration de conformité N4?",options: ["L'utilisateur de l'installation d'extincteurs.", "L'entreprise titulaire d'une certification APSAD pour l'installation d'extincteurs.", "Le fabricant des extincteurs installés.", "L'organisme de contrôle indépendant."],correct: 1},
{id:47,question: "La déclaration de conformité N4 atteste que?",options: ["Les extincteurs installés sont conformes aux normes de fabrication françaises.", "L'installation est couverte par une assurance responsabilité civile.", "L'installation a été réalisée conformément aux règles du référentiel APSAD R4.", "Le personnel a reçu une formation complète à la lutte contre l'incendie."],correct: 2},
{id:48,question: "Combien d'exemplaires de la déclaration de conformité N4 doivent être établis?",options: ["Un seul exemplaire conservé par l'installateur.", "Deux exemplaires, un pour l'installateur et un pour l'utilisateur.", "Au moins deux exemplaires : un pour l'utilisateur et un conservé par l'entreprise certifiée.", "Un exemplaire pour chaque extincteur installé."],correct: 2},
{id:49,question: "Le modèle de la déclaration de conformité N4 est fourni par?",options: ["Le fabricant des extincteurs.", "La préfecture du département.", "Le CNPP (Centre National de Prévention et de Protection).", "L'organisme certificateur."],correct: 2},
{id:50,question: "La déclaration de conformité N4 est-elle un document suffisant pour garantir la pérennité de la conformité de l'installation?",options: ["Oui, elle prouve que l'installation était conforme au moment de sa réalisation.", "Oui, elle engage la responsabilité de l'installateur pour une durée illimitée.", "Non, la maintenance et les vérifications périodiques sont également nécessaires pour maintenir la conformité.", "Non, une nouvelle déclaration doit être établie chaque année."],correct: 2},
{id:51,question: "À quelle fréquence minimale l'inspection visuelle des extincteurs doit-elle être réalisée?",options: ["Tous les mois par un organisme certifié.", "Au moins une fois par an par le personnel compétent de l'établissement.", "Tous les cinq ans lors du reconditionnement de l'appareil.", "Tous les six mois par le fabricant de l'extincteur."],correct: 1},
{id:52,question: "Que doit vérifier l'inspection visuelle?",options: ["La pression interne de l'extincteur à l'aide d'un manomètre étalonné.", "Le poids exact de l'extincteur en le pesant avec une balance de précision.", "L'accessibilité, la visibilité, l'état extérieur (absence de corrosion, de choc), l'intégrité des scellements et des inscriptions.", "La qualité de l'agent extincteur en effectuant un prélèvement pour analyse."],correct: 2},
{id:53,question: "Si une anomalie est détectée lors de l'inspection visuelle, que doit-on faire?",options: ["Prendre les mesures correctives appropriées (maintenance, réparation, remplacement de l'extincteur).", "Signaler l'anomalie dans le registre de sécurité et attendre la prochaine vérification périodique.", "Utiliser l'extincteur avec précaution en attendant la réparation.", "Informer uniquement le fabricant de l'extincteur."],correct: 0},
{id:54,question: "L'inspection visuelle doit-elle être tracée?",options: ["Oui, elle doit être enregistrée dans le registre de sécurité incendie.", "Non, une simple vérification visuelle ne nécessite pas de traçabilité.", "Oui, un rapport détaillé doit être envoyé à la compagnie d'assurance.", "Non, sauf si des anomalies sont constatées."],correct: 0},
{id:55,question: "Qui est généralement responsable de réaliser l'inspection visuelle?",options: ["Uniquement le personnel de maintenance externe certifié APSAD.", "Le personnel de l'établissement désigné et formé à cet effet.", "Uniquement le responsable de la sécurité de l'établissement.", "N'importe quel employé de l'entreprise."],correct: 1},
{id:56,question: "À quelle fréquence les vérifications périodiques des extincteurs doivent-elles être effectuées?",options: ["Tous les mois.", "Tous les ans par l'utilisateur.", "Au moins une fois par an par une entreprise compétente.", "Tous les cinq ans lors du reconditionnement."],correct: 2},
{id:57,question: "Que comprennent les vérifications périodiques?",options: ["Uniquement une inspection visuelle approfondie.", "Des contrôles plus approfondis que l'inspection visuelle, portant notamment sur l'état interne de l'appareil, le bon fonctionnement des mécanismes et la vérification de la pression.", "Uniquement le remplacement de l'agent extincteur.", "Uniquement la vérification de la signalisation."],correct: 1},
{id:58,question: "Que doit faire l'entreprise ayant réalisé la vérification périodique?",options: ["Remplacer systématiquement tous les extincteurs de plus de 5 ans.", "Former le personnel à l'utilisation des extincteurs.", "Établir un rapport de vérification mentionnant les opérations effectuées et les éventuelles anomalies constatées.", "Mettre à jour le plan d'évacuation de l'établissement."],correct: 2},
{id:59,question: "En cas d'anomalie constatée lors de la vérification périodique, que doit-il être fait?",options: ["Utiliser l'extincteur uniquement en cas d'urgence extrême.", "Signaler l'anomalie dans le registre et attendre la prochaine vérification.", "L'extincteur doit être mis hors service et une intervention corrective doit être réalisée rapidement.", "Informer uniquement la compagnie d'assurance."],correct: 2},
{id:60,question: "Selon le texte, qui doit s'assurer de la compétence de l'entreprise réalisant les vérifications périodiques?",options: ["L'utilisateur de l'installation.", "La préfecture.", "Le fabricant des extincteurs.", "L'organisme certificateur APSAD."],correct: 0},{id:61,question: "Qu'est-ce qu'une intervention corrective?",options: ["L'action de former le personnel à l'utilisation des extincteurs.", "La vérification annuelle de l'état des extincteurs.", "L'action visant à remédier à un défaut ou une anomalie constatée sur un extincteur.", "Le remplacement préventif des extincteurs après une certaine durée de vie."],correct: 2},
{id:62,question: "Quand une intervention corrective doit-elle être effectuée?",options: ["Uniquement lors de la vérification périodique annuelle.", "Selon la planification annuelle de maintenance préventive.", "Dès qu'un défaut ou une anomalie est constaté, que ce soit lors d'une inspection visuelle ou d'une vérification périodique.", "Uniquement après l'utilisation d'un extincteur."],correct: 2},
{id:63,question: "Les interventions correctives doivent être réalisées par?",options: ["Le personnel interne de l'établissement, même non formé spécifiquement.", "Toute entreprise de maintenance générale.", "Une entreprise compétente, disposant des compétences et des pièces de rechange nécessaires.", "Le fabricant de l'extincteur uniquement."],correct: 2},
{id:64,question: "Après une intervention corrective, que doit-il être fait?",options: ["Une vérification doit être effectuée pour s'assurer de l'efficacité de la correction, et une mention doit être portée au registre de sécurité.", "L'extincteur peut être remis en place immédiatement sans autre vérification.", "Il est nécessaire de remplacer systématiquement l'extincteur concerné.", "Il faut informer la compagnie d'assurance avant de remettre l'extincteur en service."],correct: 0},
{id:65,question: "Le recours à une intervention corrective peut être nécessaire en cas de?",options: ["Simple dépoussiérage de l'extincteur.", "Vérification annuelle de la pression.", "Manomètre indiquant une pression hors service, scellement rompu, corrosion importante.", "Changement de l'étiquette d'identification de l'extincteur."],correct: 2},
{id:66,question: "Qu'est-ce que la révision en atelier d'un extincteur?",options: ["Une simple vérification de l'état extérieur de l'appareil réalisée sur site.", "La recharge de l'extincteur avec de l'agent extincteur neuf.", "Une opération de maintenance approfondie réalisée dans un atelier spécialisé, pouvant inclure le démontage complet de l'appareil.", "Le contrôle de la pression interne de l'extincteur."],correct: 2},
{id:67,question: "Quand une révision en atelier est-elle généralement nécessaire?",options: ["Tous les ans.", "Après chaque utilisation de l'extincteur.", "Selon la réglementation et les préconisations du fabricant, généralement après plusieurs vérifications périodiques et/ou un certain nombre d'années.", "Uniquement en cas de dommage apparent de l'extincteur."],correct: 2},
{id:68,question: "Qui est habilité à effectuer une révision en atelier?",options: ["Le responsable de la sécurité de l'établissement.", "Toute entreprise de maintenance d'extincteurs.", "Une entreprise spécialisée disposant des compétences, des outillages et des pièces de rechange spécifiques, souvent agréée par le fabricant.", "L'utilisateur de l'extincteur après avoir suivi une formation spécifique."],correct: 2},
{id:69,question: "Quelles sont les opérations typiques réalisées lors d'une révision en atelier?",options: ["Uniquement le nettoyage externe de l'appareil.", "Démontage, nettoyage, contrôle des composants, remplacement des pièces défectueuses, épreuve hydraulique, remontage et recharge.", "Uniquement la vérification de la date de péremption de l'agent extincteur.", "Uniquement la mise à jour de l'étiquette d'identification."],correct: 1},
{id:70,question: "Après une révision en atelier, l'extincteur doit?",options: ["Être remis en service immédiatement.", "Être stocké pendant une courte période avant d'être réutilisé.", "Faire l'objet d'une vérification et d'un essai de fonctionnement avant d'être remis en service, et porter une nouvelle indication de maintenance.", "Être obligatoirement remplacé par un extincteur neuf."],correct: 2},
{id:71,question: "Les informations complémentaires mentionnées concernent notamment?",options: ["Les tarifs des prestations de maintenance des extincteurs.", "La liste des organismes de formation à la manipulation des extincteurs.", "La durée de vie des extincteurs et les conditions de leur mise hors service.", "Les coordonnées des fabricants d'extincteurs."],correct: 2},
{id:72,question: "Que doit-on faire d'un extincteur dont la durée de vie est dépassée?",options: ["Le mettre hors service et le remplacer par un appareil conforme.", "Le conserver comme extincteur de secours en cas d'urgence.", "Le revendre à un prix réduit.", "Le jeter dans une poubelle ordinaire."],correct: 0},
{id:73,question: "Le contrôle des extincteurs après utilisation doit être effectué?",options: ["Immédiatement après utilisation pour vérifier qu'il est toujours en état de fonctionnement ou doit être rechargé.", "Lors de la prochaine vérification périodique annuelle.", "Seulement si l'extincteur a été complètement vidé.", "Uniquement par le personnel ayant utilisé l'extincteur."],correct: 0},
{id:74,question: "Les informations complémentaires peuvent également porter sur?",options: ["Les techniques avancées de lutte contre l'incendie.", "La conception des systèmes de détection incendie.", "Les consignes de sécurité à respecter en cas d'incendie.", "La réglementation relative aux assurances incendie."],correct: 2},
{id:75,question: "Selon le texte, les informations portées sur l'extincteur permettent de connaître?",options: ["Le nom du dernier utilisateur.", "Le nombre total d'incendies éteints avec cet appareil.", "Les opérations de maintenance réalisées et la date de la prochaine vérification.", "Le coût d'achat initial de l'extincteur."],correct: 2}
]
export default function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  const handleAnswerClick = async (selectedAnswer: string) => {
    const current = questions[currentQuestion];
    const correctAnswer = current.options[current.correct];
    const isCorrect = selectedAnswer === correctAnswer;

    const newScore = score + (isCorrect ? 1 : 0);
    const isLastQuestion = currentQuestion + 1 >= questions.length;

    const updatedIncorrectAnswers = isCorrect
      ? incorrectAnswers
      : [
          ...incorrectAnswers,
          {
            question: current.question,
            user_answer: selectedAnswer,
            correct_answer: correctAnswer,
          },
        ];

    if (isLastQuestion) {
      setShowScore(true);
      setScore(newScore); // Pour affichage à l'écran
      const percentage = (newScore / questions.length) * 100;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from("quiz_results").insert({
          user_id: user.id,
          user_email: user.email,
          display_name: user.user_metadata.display_name || user.email,
          score: newScore,
          total_questions: questions.length,
          percentage,
          incorrect_answers: updatedIncorrectAnswers,
        });

        if (error) {
          toast.error("Erreur lors de l'enregistrement du résultat");
          console.error("Erreur Supabase :", error);
        }
      }

    } else {
      setCurrentQuestion((prev) => prev + 1);
      setScore(newScore);
      setIncorrectAnswers(updatedIncorrectAnswers);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setScore(0);
    setIncorrectAnswers([]);
    setShowScore(false);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const percentage = ((score / questions.length) * 100).toFixed(2);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Quiz Karoka</h1>

        <Card className="w-full">
          {showScore ? (
            <>
              <CardHeader>
                <CardTitle>Résultat du Quiz</CardTitle>
                <CardDescription>
                  Vous avez obtenu {score} sur {questions.length} points ({percentage}%)
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
             
                
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle>
                  Question {currentQuestion + 1}/{questions.length}
                </CardTitle>
                <CardDescription>
                  {questions[currentQuestion].question}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start text-left h-auto py-3"
                      onClick={() => handleAnswerClick(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
