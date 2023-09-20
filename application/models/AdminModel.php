<?php   
    class AdminModel extends CI_Model{
        public function __construct(){
            parent::__construct();
            // $this->load->model('ArticleModel');
        }

        public function insertData($file_path){
            $file_ext = pathinfo($file_path, PATHINFO_EXTENSION);
            $nbr = 0;
            // if ($file_ext == 'csv'){
            $file = fopen($file_path, 'r');
            while (!feof($file)){
                fgetcsv($file, 0, ',');
                while(($line = fgetcsv($file, 0, ';')) !== false){
                    $code_div = $line[0];
                    $code_ser = $line[1];
                    $label_div = $line[2];
                    $this->db->query("INSERT INTO DIVISION(CODE_DIVISION, CODE_SER, LABEL_DIVISION) VALUES('$code_div', '$code_ser', q'[$label_div]')");
                    $nbr += 1;
                }
            }
            fclose($file);
            return $nbr;
        }

        public function insertAgent($file_path){
            // $this->load->database('oracle');
            $nbr = 0;
            $file = fopen($file_path, 'r');
            while (!feof($file)){
                fgetcsv($file, 0, ',');
                while(($line = fgetcsv($file, 0, ';')) !== false){
                    $matricule = $line[0];
                    $fonction = $line[1];
                    $porte = $line[2];
                    $mail = $line[3];
                    $nom = $line[4];
                    $nom_util = $line[5];
                    $type = $line[6];
                    $prenom = $line[7];
                    $adresse = $line[8];
                    $tel = $line[9];
                    $password = $line[10];
                    $photo = $line[11];
                    $genre = $line[12];
                    $activation = $line[13];
                    $code_div = $line[14];
                    // var_dump($line[0]);
                    $this->db->query("INSERT INTO AGENT(MATRICULE, FONCTION_AG, PORTE_AG, MAIL_AG, NOM_AG, NOM_UTIL_AG, TYPE_AG, PRENOM_AG, ADRESSE_AG
                                                        ,TEL_AG,PASSWORD, PHOTO, GENRE, ACTIVATION, CODE_DIVISION) 
                                    VALUES('$matricule', q'[$fonction]', '$porte', q'[$mail]', q'[$nom]', q'[$nom_util]', q'[$type]' , q'[$prenom]' , q'[$adresse]',
                                    '$tel', '0000', '', '$genre', 'ACTIVATED', q'[$code_div]')");
                    $nbr += 1;
                }
            }
            fclose($file);
            return $nbr;
        }

        public function insertNomenclature($file_path){
            // $this->load->database('oracle');
            $nbr = 0;
            $file = fopen($file_path, 'r');
            while (!feof($file)){
                fgetcsv($file, 0, ',');
                while(($line = fgetcsv($file, 0, ';')) !== false){
                    $id_nom = $line[0];
                    $detail_nom = $line[1];
                    $this->db->query("INSERT INTO NOMENCLATURE(ID_NOM, DETAIL_NOM) VALUES('$id_nom', q'[$detail_nom]')");
                    $nbr += 1;
                }
            }
            fclose($file);
            return $nbr;
        }

        public function insertCompte($file_path){
            $nbr = 0;
            $file = fopen($file_path, 'r');
            while (!feof($file)){
                fgetcsv($file, 0, ',');
                while(($line = fgetcsv($file, 0, ';')) !== false){
                    $num_compte= $line[0];
                    $designation_compte = $line[1];
                    $this->db->query("INSERT INTO COMPTE(NUM_CMPT, DESIGNATION_CMPT) VALUES('$num_compte', q'[$designation_compte]')");
                    $nbr += 1;
                }
            }
            fclose($file);
            return $nbr;
        }

        public function insertCategorie($file_path){
            // $this->load->database('oracle');
            $nbr = 0;
            $file = fopen($file_path, 'r');
            while (!feof($file)){
                fgetcsv($file, 0, ',');
                while(($line = fgetcsv($file, 0, ';')) !== false){
                    $designation_categorie = $line[0];
                    $num_compte = $line[1];
                    $id_categorie = $line[2];
                    $this->db->query("INSERT INTO CATEGORIE(ID_CAT, LABEL_CAT, NUM_CMPT) VALUES('$id_categorie', q'[$designation_categorie]', '$num_compte')");
                    $nbr += 1;
                }
            }
            fclose($file);
            return $nbr;
        }

        public function insertArticle($file_path){
            // $this->load->database('oracle');
            $nbr = 0;
            $file = fopen($file_path, 'r');
            while (!feof($file)){
                fgetcsv($file, 0, ',');
                while(($line = fgetcsv($file, 0, ';')) !== false){
                    $formule = $line[0];
                    $designation = $line[2];
                    $specification = $line[3];
                    $unite = $line[4];
                    $effectif = $line[5];
                    $idcat = $line[1];
                    $dispo = 'dispo';
                    $codeser = 'SRSPHM';
                    $prix = 0;
                    $montant = 0;
                    $date = date('Y-m-d');
                    $this->db->query("INSERT INTO ARTICLE(FORMULE, DESIGNATION_ART, SPECIFICITE_ART, UNITE_ART, EFFECTIF_ART, ID_CAT, DISPONIBILITE_ART, CODE_SER) 
                                        VALUES('$formule', q'[$designation]', q'[$specification]', q'[$unite]', '$effectif', '$idcat', '$dispo', q'[$codeser]')");
                    $nbr += 1;

                    $this->db->query("INSERT INTO ORIGINE (ID_ORIGINE, CODE_SER, FORMULE, QUANTITE_ORG, QUANTITE_STOCK, PRIX_UNI_ORG, MONTANT_ORG, 
                                    DATE_ORG, TIME_ORG,RECU_ORG, DESCIPTION)
                                                        VALUES (
                                                            '$formule','SRSPHM','$formule','$effectif', '$effectif',$prix,$montant,TO_DATE('$date','YYYY-MM-DD'),
                                                            TO_DATE(TO_CHAR(SYSDATE,'HH24:MI:SS'),'HH24:MI:SS'),'', 'Mise en stock'
                                                        )    
                                                    ");
                }
            }
            fclose($file);
            return $nbr;
        }
    }
?>