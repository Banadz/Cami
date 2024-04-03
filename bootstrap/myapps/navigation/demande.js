$(document).ready(function () {
	let information;
	let complet = "";
	let tableLivring = $("#tableLivring").DataTable();
	let tableLivred = $("#tableLivred").DataTable();

	$(".tovalide").each(function () {
		$(this).on("click", function (kalma) {
			let artcile = "";
			$tr = $(this).closest("tr");
			$num = $(this).closest("tr").attr("id");
			var laligne = $tr
				.children("td")
				.map(function () {
					return $(this).text();
				})
				.get();
			kalma.preventDefault();

			$.ajax({
				url: "demande/info",
				method: "GET",
				data: "im=" + laligne[2].trim() + "&&num=" + $num.trim(),
				dataType: "json",
				success: function (resu) {
					if (resu.success) {
						information = resu.user[0];
						complet = resu.array;
						artcile = resu.array["ART"][0];
						$("#validationModal").modal("show");
						$(".Agent").each(function () {
							$(this).attr("id", laligne[2].trim());
							$(this).html(
								information["MATRICULE"].trim() +
									" - " +
									information["NOM_AG"].trim() +
									" " +
									information["PRENOM_AG"].trim()
							);
						});
						$(".structure").each(function () {
							$(this).attr("id", laligne[4].trim());
							$(this).html(
								information["CODE_SER"].trim() +
									" - " +
									information["CODE_DIVISION".trim()]
							);
						});
						$(".article").each(function () {
							$(this).html(
								laligne[5].trim() +
									". (Quantité du stock: " +
									artcile["EFFECTIF_ART"].trim() +
									")"
							);
						});
						$("#requestQ").val(laligne[6].trim());
					} else {
						swal("Echéc", "Erreur du chargement de données", {
							icon: "error",
							buttons: {
								confirm: {
									className: "btn btn-danger",
								},
							},
						});
					}
				},
			});
		});
	});

	// $("#tableLivring tbody").on("click", ".toreceive", function () {
	// 	var row = $(this).closest("tr"); // Obtenir la ligne parente du bouton cliqué

	// 	// Utiliser la méthode row() pour obtenir l'objet de la ligne DataTable correspondante
	// 	var rowObj = tableLivring.row(row);

	// 	// Supprimer la ligne
	// 	rowObj.remove().draw(false);
	// });

	// $(".toreceive").each(function () {
	$("#tableLivring tbody").on("click", ".toreceive", function () {
		var $clickedButton = $(this);
		swal("Attentoin", "Avez-vous vraiment réçu l'objet de la demande?", {
			icon: "warning",
			buttons: {
				confirm: {
					text: "Oui",
					className: "btn btn-warning",
				},
				cancel: {
					visible: true,
					text: "Annuler",
					className: "btn",
				},
			},
		}).then((Delete) => {
			if (Delete) {
				$tr = $clickedButton.closest("tr");
				num = $(this).closest("tr").attr("id");

				$.ajax({
					url: "http://192.168.88.40:8080/CAMI/DemandeController/Recevoir",
					type: "GET",
					data: "num=" + num.trim(),
					dataType: "json",
					success: function (reponse, status) {
						console.log(reponse);

						if (reponse.error) {
							swal("Echéc", reponse.error, {
								icon: "error",
								buttons: {
									confirm: {
										className: "btn btn-danger",
									},
								},
							});
							console.log(reponse.error);
						}
						if (reponse.success) {
							swal("Succés", reponse.success, {
								icon: "success",
								buttons: {
									confirm: {
										className: "btn btn-success",
									},
								},
							}).then((Delete) => {
								if (Delete) {
									var row = $clickedButton.closest("tr");
									var rowData = tableLivring.row(row).data();
									var rowObj = tableLivring.row(row);
									rowObj.remove().draw(false);
									$("#tableLivred").dataTable().fnAddData([
										rowData[0],
										rowData[1],
										rowData[2],
										rowData[3],
										rowData[4],
										rowData[5],
										rowData[6],
										rowData[7],
										rowData[8],
										"Livré", // État
									]);

									// $newTr.appendTo("#tableLivred tbody");
								}
							});
						}
					},
				});
			} else {
				swal.close();
			}
		});
		// });
	});

	$("#accDemForm").on("submit", function (vona) {
		vona.preventDefault();
		// console.log(complet['DEM'][0])
		let num = complet["DEM"][0]["NUMEROTATION"].trim();
		// console.log(num)
		let qte = $("#acceptQ").val().trim();
		if (!qte || qte == "") {
			swal("Echéc", "Veuillez indiquer la quantité à accorder", {
				icon: "error",
				buttons: {
					confirm: {
						className: "btn btn-danger",
					},
				},
			});
		} else {
			swal({
				title: "Voulez vous accorder " + qte + "?",
				text:
					"Veuillez bien vérifier les informations pour la demande " + num + "",
				icon: "warning",
				buttons: {
					confirm: {
						text: "Oui",
						className: "btn btn-warning",
					},
					cancel: {
						visible: true,
						text: "Annuler",
						className: "btn",
					},
				},
			}).then((Delete) => {
				if (Delete) {
					$.ajax({
						url: "http://192.168.88.40:8080/CAMI/DemandeController/validation",
						type: "GET",
						data: "num=" + num.trim() + "&&qte=" + qte.trim(),
						dataType: "json",
						success: function (reponse, status) {
							console.log(reponse);
							if (reponse.error) {
								swal("Echèc", reponse.error, {
									icon: "error",
									buttons: {
										confirm: {
											className: "btn btn-danger",
										},
									},
								});
								console.log(reponse.error);
							} else {
								if (reponse.warning) {
									swal("Attention", reponse.warning, {
										icon: "warning",
										buttons: {
											confirm: {
												text: "Accorder",
												className: "btn btn-warning",
											},
											cancel: {
												visible: true,
												text: "Annuler",
												className: "btn btn-success",
											},
										},
									}).then((Delete) => {
										if (Delete) {
											// alert("ato");
											$.ajax({
												url: "http://192.168.88.40:8080/CAMI/DemandeController/acceptWarning",
												type: "GET",
												data:
													"num=" +
													reponse.info[0].num.trim() +
													"&&inputQte=" +
													reponse.info[0].inputQte.trim() +
													"&&formule=" +
													reponse.info[0].formule.trim(),
												dataType: "json",
												success: function (reponsy, state) {
													console.log(reponsy);
													if (reponsy.success) {
														// alert('tody');
														swal("Succés", reponsy.success, {
															icon: "success",
															buttons: {
																confirm: {
																	className: "btn btn-success",
																},
															},
														}).then((Delete) => {
															if (Delete) {
																window.location.href =
																	"http://192.168.88.40:8080/CAMI/demande";
															}
														});
													}
												},
											});
										}
									});
								}
								if (reponse.success) {
									swal("Succés", reponse.success, {
										icon: "success",
										buttons: {
											confirm: {
												className: "btn btn-success",
											},
										},
									}).then((Delete) => {
										if (Delete) {
											window.location.reload();
										}
									});
								}
							}
						},
					});
				} else {
					swal.close();
				}
			});
		}
	});

	var refuser = $(".refusebtn");

	$(refuser).each(function () {
		$(this).on("click", function (evt) {
			evt.preventDefault();
			id = $(this).closest("tr").attr("id");
			// url = $(this).closest('tr').attr('a');
			// alert(url);
			swal({
				title: "Refuser la demande?",
				text:
					"La demande n° " +
					id.trim() +
					" sera refusée! Cet action est irreversible",
				icon: "warning",
				buttons: {
					confirm: {
						text: "Oui",
						className: "btn btn-warning",
					},
					cancel: {
						visible: true,
						text: "Annuler",
						className: "btn",
					},
				},
			}).then((Delete) => {
				if (Delete) {
					$.ajax({
						url: "http://192.168.88.40:8080/CAMI/DemandeController/refuse",
						type: "GET",
						data: "num=" + id.trim(),
						dataType: "json",
						success: function (reponse, status) {
							console.log(reponse);

							if (reponse.error) {
								swal("Echéc", reponse.error, {
									icon: "error",
									buttons: {
										confirm: {
											className: "btn btn-danger",
										},
									},
								});
								console.log(reponse.error);
							}
							if (reponse.success) {
								swal("Succés", reponse.success, {
									icon: "success",
									buttons: {
										confirm: {
											className: "btn btn-success",
										},
									},
								}).then((Delete) => {
									if (Delete) {
										window.location.reload();
									}
								});
							}
						},
					});
				} else {
					swal.close();
				}
			});
		});
	});
});
