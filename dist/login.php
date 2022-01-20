<?php
sleep(1);
echo json_encode($_POST['username'] == 'admin' && $_POST['password'] == 'admin');
