<?php
// Set working directory to your Git repo
$repo_dir = '/home2/traffylv/public_html/SAAS';
$git_bin_path = '/usr/bin/git'; // Usually correct for cPanel servers

// Log file for debugging
$log_file = $repo_dir . '/deploy.log';
file_put_contents($log_file, "===== Deployment Started at " . date('Y-m-d H:i:s') . " =====\n", FILE_APPEND);

// Go to the repo
chdir($repo_dir);

// Fetch and reset to latest
exec("$git_bin_path fetch --all 2>&1", $output);
exec("$git_bin_path reset --hard origin/main 2>&1", $output);
exec("$git_bin_path pull 2>&1", $output);

// Log output
file_put_contents($log_file, implode("\n", $output) . "\n", FILE_APPEND);
file_put_contents($log_file, "===== Deployment Finished =====\n", FILE_APPEND);

echo "Deployment completed!";
?>
