/**
 * 
 */
function loadFile(i) {
	if(window.XMLHttpRequest){
		var xhr = new XMLHttpRequest();//on instancie l'objet XMLHttpRequest
	}
	else{
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	// On souhaite juste récupérer le contenu du fichier, la méthode GET suffit amplement :
	if(i==1){//si le click est pour les auteurs
		var value1=1;//on met le paramètre à 2 pour signifier que le click est pour les auteurs
		value1=encodeURIComponent(value1);//on encode pour que le paramètre puisse être transmis dans l'URL
		xhr.open('GET', 'ajax.php?param1='+value1);//on précise le fichier sur le serveur (souvent un fichier php) que l'on ouvre et qui va nous générer un fichier de données (au format xml, JSON, texte...).
		//de plus, on passe un paramètre pour préciser au fichier php si il doit rasssembler les données relatives aux auteurs ou aux musiciens.
	}
	else{//si le click est pour les musiciens
		var value2=2;//on met le paramètre à 2 pour signifier que le click est pour les musiciens
		value2=encodeURIComponent(value2);//on encode pour que le paramètre puisse être transmis dans l'URL
		xhr.open('GET', 'ajax.php?param2='+value2);//on précise le fichier sur le serveur (souvent un fichier php) que l'on ouvre et qui va nous générer un fichier de données (au format xml, JSON, texte...).
		//de plus, on passe un paramètre pour préciser au fichier php si il doit rasssembler les données relatives aux auteurs ou aux musiciens.
	}
	xhr.overrideMimeType('text/xml');
	xhr.send(null); // La requête est prête, on envoie tout au fichier sur le serveur que l'on a spécifié avec open()!

	xhr.addEventListener('readystatechange', function() { // On est ici dans un mode asynchrone 

		if (xhr.readyState === XMLHttpRequest.DONE && (xhr.status === 200 || xhr.status === 0)) { // Si le fichier de donnéees (au format xml, JSON, texte...) généré par le fichier serveur a bien été reçu et ce, sans erreur...(ici on a contacté directement le fichier de données)
			//si le fichier de données a bien été reçu, il se stocke dans la propriété responseXML si le fichier de données est au format xml et dans la propriété responseText s'il s'agit d'un autre format.

			var xmlDoc = xhr.responseXML;//on récupère le xml envoyé par le serveur
			txt = "";
			if(i==1){//si c'est les auteurs...
				var x = xmlDoc.getElementsByTagName("nom");//on récupère les balises <nom>
			}
			else{//si c'est les musiciens...
				var x = xmlDoc.getElementsByTagName("prenom");//on récupère les balises <prenom>
			}
			for (i = 0; i < x.length; i++) {//pour toutes les balises <nom> ou <prenom>
				txt += x[i].childNodes[0].nodeValue;//on récupère le texte de ces balises
				txt +='<br/>';
			}
			document.getElementById('fileContent').innerHTML = '<span>' + txt + '</span>'+'<br/>'; // On l'affiche les données dans la page html

		} else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status != 200) { // En cas d'erreur !

			alert('Une erreur est survenue !\n\nCode :' + xhr.status + '\nTexte : ' + xhr.statusText);//on affiche une erreur avec l'id de l'erreur et le texte de l'erreur

		}

	});


}

(function() { // Comme d'habitude, une IIFE pour éviter les variables globales

	var inputs = document.getElementsByTagName('button'),//on met l'input dans une variable grâce au DOM
	inputsLen = inputs.length;//on définit une varible avec la longueur du tableau input (donc le nombre d'input dans le html)


	inputs[0].addEventListener('click', function() {//on leur définit un événement de type onclick
		loadFile(1); // À chaque click sur ce bouton on réalise l'ajax, le 1 du paramètre sert à informer le fichier serveur qu'il doit rassembler les infos pour les auteurs
	});

	inputs[1].addEventListener('click', function() {//on leur définit un événement de type onclick
		loadFile(2); // À chaque click,  sur ce bouton on réalise l'ajax, le 2 du paramètre sert à informer le fichier serveur qu'il doit rassembler les infos pour les musiciens
	});

})();
