<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=UTF-8');
const DESTINATION_EMAIL = 'ej@davispestsol.co.nz';
function reply(int $status, bool $success, string $message): never { http_response_code($status); echo json_encode(['success'=>$success,'message'=>$message], JSON_UNESCAPED_SLASHES); exit; }
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') reply(405,false,'Method Not Allowed');
if (!empty($_POST['website'] ?? '')) reply(200,true,'Thanks! Your enquiry has been received.');
function field(string $name,int $max): string { $value=trim((string)($_POST[$name]??'')); $value=preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u','',$value)??''; return mb_substr($value,0,$max); }
$data=['Full Name'=>field('name',100),'Phone'=>field('phone',40),'Email'=>field('email',150),'Suburb / Area'=>field('suburb',100),'Property Type'=>field('property_type',100),'Pest Problem / Service'=>field('service',100),'Residential / Commercial'=>field('customer_type',30),'Preferred Contact Method'=>field('preferred_contact',30),'Message'=>field('message',3000)];
foreach($data as $label=>$value) if($value==='') reply(422,false,$label.' is required.');
if(!filter_var($data['Email'],FILTER_VALIDATE_EMAIL)||preg_match('/[\r\n]/',$data['Email'])) reply(422,false,'Please enter a valid email address.');
if(!in_array($data['Residential / Commercial'],['Residential','Commercial'],true)) reply(422,false,'Please select residential or commercial.');
if(!in_array($data['Preferred Contact Method'],['Phone Call','Text Message','Email'],true)) reply(422,false,'Please select a valid contact method.');
$body="New Website Enquiry - Davis Pest Solutions\n\n"; foreach($data as $label=>$value) $body.=$label.":\n".$value."\n\n"; $body.='Submitted: '.date(DATE_RFC2822)."\n";
$headers=['From: Davis Website <website@davispestsol.co.nz>','Reply-To: '.$data['Email'],'Content-Type: text/plain; charset=UTF-8','X-Mailer: PHP/'.PHP_VERSION];
$sent = PHP_SAPI === 'cli-server' ? true : mail(DESTINATION_EMAIL,'New Website Enquiry - Davis Pest Solutions',$body,implode("\r\n",$headers));
if(!$sent) reply(500,false,"We couldn't send your enquiry right now. Please try again or contact Davis Pest Solutions directly.");
reply(200,true,'Thanks! Your enquiry has been received. EJ will get back to you as soon as possible.');
