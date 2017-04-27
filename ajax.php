<?php
header ('Content-Type:text/xml'); // obligatoire si on veut travailler avec le xml en php
$doc = new DOMDocument (); // on va renvoyer des résultats au format XML donc on prépare un objet DOM.
                          // nous voulons un joli affichage
$doc->formatOutput = true;
if (isset ( $_GET ['param1'] )) { // si l'utilisateur a cliqué pour voir les auteurs...
	$root = $doc->createElement ( 'autor' ); // on crée une balise XML <autor>
	$root = $doc->appendChild ( $root ); // on l'attache au DOM
} else { // si l'utilisateur a cliqué pour voir les musiciens...
	$root = $doc->createElement ( 'musicien' ); // on prépare la racine du DOM
	$root = $doc->appendChild ( $root ); // on l'attache au DOM
}

try { // connexion à la BDD
	$serveurname = "localhost";
	$bddname = "test3";
	$username = "root";
	$password = "MONPASSWORD"; // A REMPLACER PAR LE VRAI PASSWORD.
	
	// on se connecte à MYSQL
	$bdd = new PDO ( 'mysql:host=' . $serveurname . ';dbname=' . $bddname . ';chaset=utf8', $username, $password );
	// on active le verbose sur les erreurs (pour avoir des messages clairs)
	array (
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION 
	);
} catch ( Exeption $e ) {
	echo 'Connexion fail: <br/>';
	// En cas d'erreurs, on affiche un message d'erreur et on arrête tout.
	die ( 'Erreur: ' . $e->getMessage () );
}

// on lance la requete
if (isset ( $_GET ['param1'] )) { // si l'utilisateur a cliqué pour voir les auteurs...
	
	$query1 = "SELECT nom FROM auteur"; // on écrit la requète correspondante
	$reponse = $bdd->query ( $query1 ); // on envoit la requète
	                              
	// On boucle sur le resultat
	while ( $row = $reponse->fetch () ) {
		$title = $doc->createElement ( 'nom' ); // on crée une balise XML <nom>
		$title = $root->appendChild ( $title ); // on l'attache au DOM
		
		$text = $doc->createTextNode ( $row[0] ); // on crée une balise XML de type text avec le nom de l'auteur
		$text = $title->appendChild ( $text ); // on l'attache au DOM en tant qu'enfant de la balise <nom>
	}
	// on termine le traitement de la requète (pour pouvoir en faire d'autres)
	$reponse->closecursor ();
} else { // si l'utilisateur a cliqué pour voir les musiciens...
	
	$query1 = "SELECT prenom FROM musicien"; // on écrit la requète correspondante
	$reponse = $bdd->query ( $query1 ); // on envoit la requète
	                               
	// On boucle sur le resultat
	while ( $row = $reponse->fetch () ) {
		$title = $doc->createElement ( 'prenom' ); // on crée une balise XML <prenom>
		$title = $root->appendChild ( $title ); // on l'attache au DOM
		
		$text = $doc->createTextNode ( $row [0] ); // on crée une balise XML de type text avec le nom du musicien
		$text = $title->appendChild ( $text ); // on l'attache au DOM en tant qu'enfant de la balise <prenom>
	}
	// on termine le traitement de la requète (pour pouvoir en faire d'autres)
	$reponse->closecursor ();
}

$docXmlServeurResponse = $doc->saveXML (); // on stocke l'arbre DOM XML que l'on a créé dans une variable string
echo $docXmlServeurResponse; // on retourne le XML calculé sous forme de chaine de caractère, ce qui est bien le but de cette page php:
                             // générer du XML contenant les données voulues que le JavaScript va pouvoir récupérer pour afficher les infos dans la page.
?>