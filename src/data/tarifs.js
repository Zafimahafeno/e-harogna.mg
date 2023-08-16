const data = { 
	tarifs : [
		{ 
			name : "trimestriel",
			cover_image : 'images/tarif-trimestriel.png' , 
			old_price : "15 000 Ar" , 
			new_price : "12 000 Ar / 3 mois" , 
			memberType: "memberMonthly" 
		},
		{ 
			name : "annuel",
			cover_image : 'images/tarif-annuel.png' ,
			old_price : "60 000 Ar",
			new_price : "40 000 Ar / an" , 
			memberType: "memberYearly" 
		}, 
		{ 
			name : "VIP",
			cover_image : 'images/tarif-elite.png' ,
			new_price : "50 000Ar / 3 mois" , 
			memberType: "memberVIP" 
		}
	],

	descriptions : [
	  { 
		  text: "Formations professionnel en ligne", 
		  available_for : ["VIP", "annuel", "trimestriel"]
	  },
	  { 
		  text: "Cours présentiels", 
		  available_for : ["VIP", "annuel", "trimestriel"]
	  },
	  { 
		  text: "Page de recherche d'emploi", 
		  available_for : ["VIP", "annuel", "trimestriel"]
	  },
	  { 
		  text: "Appui à la recherche de stage", 
		  available_for : ["VIP", "annuel"]
	  },
	  { 
		  text: "Bibliothèque et Connexion Alliance Française", 
		  available_for : ["VIP", "annuel"]
	  },
	  { 
		  text: "Club de langue", 
		  available_for : ["VIP", "annuel"]
	  },
	  { 
		  text: "Accompagnement", 
		  available_for : ["VIP"]
	  },
	]
};

module.exports = { data };
