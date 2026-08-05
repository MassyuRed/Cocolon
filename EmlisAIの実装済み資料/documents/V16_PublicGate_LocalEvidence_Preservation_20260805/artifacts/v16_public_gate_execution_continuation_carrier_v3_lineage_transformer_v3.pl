#!/usr/bin/perl
use strict;
use warnings;
use Digest::SHA qw(sha256_hex);
use Fcntl qw(O_RDONLY O_NOFOLLOW :mode);
use File::Spec ();
use Errno qw(ENOENT);

my $SOURCE_REL = 'v16_retry2_draft/v16_public_gate_execution_continuation_inactive_authority_v2.txt';
my $TARGET_REL = 'v16_retry2_draft/v16_public_gate_execution_continuation_inactive_authority_v3.txt';
my $EXPECTED_SOURCE_RAW_BYTES = 20662;
my $EXPECTED_SOURCE_RAW_SHA256 = '0c86891396efe72c214cc767a001f19ba83c2c1b5e4f1105c8df2035daeaaf19';
my $EXPECTED_SOURCE_VECTOR_BYTES = 20661;
my $EXPECTED_SOURCE_VECTOR_SHA256 = '337e93a62f77064d3a2e9099db999b4cfd280b6d52c3a2e2859251dcca95a0a4';
my $TECHNICAL_SUFFIX_ANCHOR = 'E5D_AUTHORITY_ASCII_BYTES_7739';
my $EXPECTED_TECHNICAL_SUFFIX_BYTES = 19396;
my $EXPECTED_TECHNICAL_SUFFIX_SHA256 = '1d666aabe8585cbe4647913f926a48886ec307454b00f02ae863f557f5ebdc65';
my $EXPECTED_SOURCE_PREFIX_BYTES = 1265;
my $HEADER_CONTEXT = 'NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_GATE_B_V16_PUBLIC_FULL_GATE_AND_CLOSED_SYNTHETIC_ONLY_PREFLIGHT_EXECUTION_CONTINUATION_AUTHORITY_V4_';
my $OLD_HEADER_MARKER = '_AUTHORITY_V4_';
my $NEW_HEADER_MARKER = '_AUTHORITY_V5_';
my $OLD_CURRENT_CARRIER_PATH = 'V16_PUBLIC_GATE_EXECUTION_CONTINUATION_INACTIVE_AUTHORITY_V2_DOT_TXT';
my $NEW_CURRENT_CARRIER_PATH = 'V16_PUBLIC_GATE_EXECUTION_CONTINUATION_INACTIVE_AUTHORITY_V3_DOT_TXT';

sub stop_now {
    my ($code) = @_;
    exit($code);
}

sub literal_count {
    my ($haystack, $needle) = @_;
    stop_now(90) if !defined($needle) || $needle eq '';
    my $count = 0;
    my $offset = 0;
    while (1) {
        my $found = index($haystack, $needle, $offset);
        last if $found < 0;
        $count++;
        $offset = $found + length($needle);
    }
    return $count;
}

sub replace_literal_exact1 {
    my ($text, $old, $new) = @_;
    stop_now(91) unless literal_count($text, $old) == 1;
    stop_now(92) unless literal_count($text, $new) == 0;
    my $offset = index($text, $old);
    substr($text, $offset, length($old), $new);
    return $text;
}

sub validate_identity_argument {
    my ($bytes, $sha) = @_;
    stop_now(30) unless defined($bytes) && $bytes =~ /\A[1-9][0-9]{0,19}\z/;
    stop_now(31) unless defined($sha) && $sha =~ /\A[0-9A-Fa-f]{64}\z/;
    return ($bytes, uc($sha));
}

sub validate_relative_path {
    my ($relative) = @_;
    stop_now(32) if !defined($relative) || $relative eq '';
    stop_now(33) if File::Spec->file_name_is_absolute($relative);
    stop_now(34) if $relative =~ /\0/;
    stop_now(35) if $relative =~ m{(?:\A|/)\.\.?(?:/|\z)};
    stop_now(36) unless $relative =~ /\A[A-Za-z0-9_.\/-]+\z/;
    stop_now(37) unless File::Spec->canonpath($relative) eq $relative;
    return $relative;
}

sub validate_workspace_root {
    my ($root) = @_;
    stop_now(38) if !defined($root) || $root eq '' || $root =~ /\0/;
    stop_now(39) unless File::Spec->file_name_is_absolute($root);
    stop_now(40) if $root =~ m{(?:\A|/)\.\.?(?:/|\z)};
    stop_now(41) unless File::Spec->canonpath($root) eq $root;
    stop_now(42) if $root eq File::Spec->rootdir();
    stop_now(43) if $root =~ m{/\z};
    return $root;
}

sub construct_contained_path {
    my ($root, $relative) = @_;
    validate_relative_path($relative);
    my $path = File::Spec->catfile($root, split(m{/}, $relative));
    $path = File::Spec->canonpath($path);
    stop_now(44) unless File::Spec->file_name_is_absolute($path);
    stop_now(45) unless index($path, $root . '/') == 0;
    return $path;
}

sub read_whole_regular_nofollow {
    my ($path) = @_;
    sysopen(my $handle, $path, O_RDONLY | O_NOFOLLOW) or stop_now(50);
    my @stat = stat($handle);
    stop_now(51) unless @stat && S_ISREG($stat[2]);
    stop_now(52) unless ($stat[2] & 07777) == 0644;
    my $buffer = '';
    while (1) {
        my $chunk = '';
        my $read = sysread($handle, $chunk, 65536);
        stop_now(53) unless defined($read);
        last if $read == 0;
        $buffer .= $chunk;
    }
    close($handle) or stop_now(54);
    stop_now(55) unless $stat[7] == length($buffer);
    return $buffer;
}

sub build_lineage_bundle {
    my ($future_bytes, $future_sha, $transformer_bytes, $transformer_sha) = @_;
    my $t03 =
        'T03_PRIOR_MASH_NATURAL_LANGUAGE_V2_CARRIER_CORRECTION_PREPARATION_AUTHORITY_' .
        'DISTINCT_FROM_SHA475ACC_HARNESS_PREPARATION_AUTHORITY_EXACT1_' .
        'APPROVED_EXACT1_ACTIVATED_EXACT1_CONSUMED_EXACT1_CLOSED_EXACT1_SINGLE_USE_EXACT1_' .
        'RESULT_V2_CREATE_FREEZE_AND_FOUR_REVIEW_ATTEMPT_EXACT1_' .
        'REACTIVATION_RECONSUMPTION_REUSE_REEXECUTION_RETRY_EXACT0_EACH_';
    my $t04 =
        'T04_SHA475ACC_PRIOR_HARNESS_PREPARATION_AUTHORITY_EXACT_VECTOR_ASCII_BYTES_12524_' .
        'SHA256_475ACCAE98519B09D53DEEA3B42DC416FB49791C987EE25DE1D24F2EFAE7B0DC_' .
        'APPROVED_EXACT1_ACTIVATED_EXACT1_CONSUMED_EXACT1_CLOSED_EXACT1_SINGLE_USE_EXACT1_' .
        'DISTINCT_FROM_PRIOR_MASH_NATURAL_LANGUAGE_V2_CARRIER_CORRECTION_PREPARATION_AUTHORITY_EXACT1_' .
        'REACTIVATION_RECONSUMPTION_REUSE_REEXECUTION_RETRY_EXACT0_EACH_';
    my $t05 =
        'T05_PREDECESSOR_PREPARATION_AUTHORITY_EXACT_VECTOR_ASCII_BYTES_9822_' .
        'SHA256_3BDBC591BF70007E6157BCE29DB210BFDFD8D36969B5B30CC97AC4834DA253BE_' .
        'APPROVED_BY_MASH_EXACT1_ACTIVATED_EXACT1_CONSUMED_EXACT1_SINGLE_USE_EXACT1_' .
        'OUTER_FUNCTIONS_EXEC_ORCHESTRATION_EVALUATION_ATTEMPT_EXACT1_' .
        'JAVASCRIPT_TEMPLATE_INTERPOLATION_REFERENCE_ERROR_LABEL_IS_NOT_DEFINED_EXACT1_' .
        'NESTED_EXEC_COMMAND_INVOCATION_EXACT0_NESTED_APPLY_PATCH_INVOCATION_EXACT0_' .
        'SOURCE_V2_ACCESS_READ_STAT_HASH_EXACT0_EACH_' .
        'TARGET_V3_ABSENCE_CHECK_CREATE_WRITE_FREEZE_REVIEW_EXACT0_EACH_' .
        'GITHUB_PRIVATE_HARNESS_TECHNICAL_EFFECT_EXACT0_EACH_TECHNICAL_CREDIT_EXACT0_' .
        'CONSUMED_PRETOOL_ORCHESTRATION_BLOCKER_STOP_EXACT1_ALREADY_CONSUMED_STATE_PRESERVED_EXACT1_' .
        'REACTIVATION_RECONSUMPTION_REUSE_REEXECUTION_RETRY_EXACT0_EACH_';
    my $t06 =
        'T06_COMPOSITE_TRANSFORMER_PREPARATION_LINEAGE_' .
        'PRIOR_0983_TRANSFORMER_V1_PREPARATION_AUTHORITY_EXACT_VECTOR_ASCII_BYTES_11472_' .
        'SHA256_0983AC19ECCD23D9ED86D0A8C1EAAE2925BDBAF1324DAE04AF13D78E7ED60501_' .
        'APPROVED_BY_MASH_EXACT1_ACTIVATED_EXACT1_CONSUMED_EXACT1_CLOSED_EXACT1_SINGLE_USE_EXACT1_' .
        'RESULT_TRANSFORMER_V1_CREATE_WRITE_CLOSE_FREEZE_EXACT1_' .
        'TRANSFORMER_V1_RELATIVE_PATH_V16_RETRY2_DRAFT_SLASH_' .
        'V16_PUBLIC_GATE_EXECUTION_CONTINUATION_CARRIER_V3_LINEAGE_TRANSFORMER_V1_DOT_PL_' .
        'RAW_BYTES_11843_LF_254_CR_EXACT0_FINAL_LF_TRUE_MODE_0644_' .
        'RAW_SHA256_1B9B16E740D6DFF5AC1461B3F9F15BBA1F47F6426CABF4F6BAF2254C6E799667_' .
        'STATIC_REVIEW_ATTEMPT_EXACT4_PASS_EXACT0_BLOCKER_STOP_EXACT1_' .
        'REACTIVATION_RECONSUMPTION_REUSE_REEXECUTION_RETRY_EXACT0_EACH_' .
        'DISTINCT_PRIOR_MASH_NATURAL_LANGUAGE_TRANSFORMER_V2_BOUNDED_CORRECTION_PREPARATION_AUTHORITY_' .
        'DISTINCT_FROM_0983_AUTHORITY_EXACT1_NO_FROZEN_TOKEN_IDENTITY_EXACT1_' .
        'APPROVED_BY_MASH_EXACT1_ACTIVATED_EXACT1_CONSUMED_EXACT1_CLOSED_EXACT1_SINGLE_USE_EXACT1_' .
        'RESULT_TRANSFORMER_V2_EXCLUSIVE_NEW_FILE_CREATE_WRITE_CLOSE_FREEZE_EXACT1_' .
        'TRANSFORMER_V2_RELATIVE_PATH_V16_RETRY2_DRAFT_SLASH_' .
        'V16_PUBLIC_GATE_EXECUTION_CONTINUATION_CARRIER_V3_LINEAGE_TRANSFORMER_V2_DOT_PL_' .
        'RAW_BYTES_11836_LF_249_CR_EXACT0_FINAL_LF_TRUE_MODE_0644_' .
        'RAW_SHA256_7998902B29931E83AAC751516A31F0D8FD203B55A498647B311E0A1B3DA7069A_' .
        'STATIC_REVIEW_ATTEMPT_EXACT4_PASS_EXACT0_BLOCKER_STOP_EXACT1_' .
        'BLOCKER_T06_0983_TO_V2_FALSE_ATTRIBUTION_EXACT1_' .
        'BLOCKER_UNCHECKED_SYSWRITE_PARTIAL_OR_ERROR_FALSE_SUCCESS_EXACT1_' .
        'BLOCKER_TARGET_ABSENCE_O_RDONLY_OPEN_CAN_BLOCK_ON_FIFO_OR_DEVICE_EXACT1_' .
        'BLOCKER_WORKSPACE_ROOT_DOT_SEGMENT_ACCEPTANCE_EXACT1_' .
        'REACTIVATION_RECONSUMPTION_REUSE_REEXECUTION_RETRY_EXACT0_EACH_' .
        'CURRENT_TRANSFORMER_V3_PREPARATION_AUTHORITY_EXACT_VECTOR_ASCII_BYTES_16416_' .
        'SHA256_FAC59C843757FC3CC2F80489D50212D95A4D2A1055861F515C7142CE26C40F1E_' .
        'APPROVED_BY_MASH_EXACT1_ACTIVATED_EXACT1_CONSUMED_EXACT1_CLOSED_EXACT1_SINGLE_USE_EXACT1_' .
        'TRANSFORMER_V3_RELATIVE_PATH_V16_RETRY2_DRAFT_SLASH_' .
        'V16_PUBLIC_GATE_EXECUTION_CONTINUATION_CARRIER_V3_LINEAGE_TRANSFORMER_V3_DOT_PL_' .
        'FROZEN_TRANSFORMER_RAW_BYTES_' . $transformer_bytes .
        '_RAW_SHA256_' . $transformer_sha .
        '_CREATE_WRITE_CLOSE_FREEZE_EXACT1_' .
        'STATIC_REVIEW_PASS_EXACT1_BY_KAREN_AND_EACH_OF_THREE_SUBAGENTS_EXACT1_EACH_TOTAL_EXACT4_' .
        'ALREADY_CONSUMED_STATE_PRESERVED_EXACT1_' .
        'REACTIVATION_RECONSUMPTION_REUSE_REEXECUTION_RETRY_EXACT0_EACH_';
    my $t07 =
        'T07_FUTURE_EXECUTION_APPLY_AUTHORITY_EXACT_VECTOR_ASCII_BYTES_' . $future_bytes .
        '_SHA256_' . $future_sha .
        '_APPROVED_BY_MASH_EXACT1_ACTIVATED_EXACT1_CONSUMED_EXACT1_SINGLE_USE_EXACT1_' .
        'V3_EXCLUSIVE_CREATION_ATTEMPT_EXACT1_POSTFREEZE_V3_REVIEW_PENDING_EXACT1_' .
        'SUCCESSOR_CARRIER_PRESENTATION_APPROVAL_ACTIVATION_CONSUMPTION_EXECUTION_EXACT0_EACH_' .
        'REACTIVATION_RECONSUMPTION_REUSE_REEXECUTION_RETRY_EXACT0_EACH_';
    return $t03 . $t04 . $t05 . $t06 . $t07;
}

sub validate_target_vector {
    my ($target, $suffix) = @_;
    stop_now(70) unless $target =~ /\A[\x20-\x7E]+\z/;
    stop_now(71) if index($target, "\n") >= 0 || index($target, "\r") >= 0;
    stop_now(72) unless literal_count($target, $TECHNICAL_SUFFIX_ANCHOR) == 1;
    stop_now(73) unless substr($target, -length($suffix)) eq $suffix;
    stop_now(74) unless literal_count($target, 'T03_PRIOR_MASH_NATURAL_LANGUAGE_V2_CARRIER_CORRECTION_PREPARATION_AUTHORITY_') == 1;
    stop_now(75) unless literal_count($target, 'T04_SHA475ACC_PRIOR_HARNESS_PREPARATION_AUTHORITY_') == 1;
    stop_now(76) unless literal_count($target, 'T05_PREDECESSOR_PREPARATION_AUTHORITY_') == 1;
    stop_now(77) unless literal_count($target, 'T06_COMPOSITE_TRANSFORMER_PREPARATION_LINEAGE_') == 1;
    stop_now(78) unless literal_count($target, 'T07_FUTURE_EXECUTION_APPLY_AUTHORITY_') == 1;
}

sub validate_patch_payload {
    my ($patch, $target_vector, $workspace_root) = @_;
    my @lines = split(/\n/, $patch, -1);
    stop_now(80) unless @lines == 5 && $lines[4] eq '';
    stop_now(81) unless $lines[0] eq '*** Begin Patch';
    stop_now(82) unless $lines[1] eq '*** Add File: ' . $TARGET_REL;
    stop_now(83) unless $lines[2] eq '+' . $target_vector;
    stop_now(84) unless $lines[3] eq '*** End Patch';
    stop_now(85) unless literal_count($patch, '*** Add File: ') == 1;
    stop_now(86) unless literal_count($patch, '*** Begin Patch') == 1;
    stop_now(87) unless literal_count($patch, '*** End Patch') == 1;
    stop_now(88) if $patch =~ /^\*\*\* (?:Update|Delete|Move) File:/m;
    stop_now(89) if index($patch, $workspace_root) >= 0;
}

sub write_stdout_whole {
    my ($payload) = @_;
    local $SIG{PIPE} = 'IGNORE';
    my $offset = 0;
    while ($offset < length($payload)) {
        my $written = syswrite(STDOUT, $payload, length($payload) - $offset, $offset);
        stop_now(94) unless defined($written) && $written > 0;
        $offset += $written;
    }
    stop_now(95) unless $offset == length($payload);
}

sub main {
    stop_now(10) unless @ARGV == 5;
    my ($workspace_root, $future_bytes, $future_sha, $transformer_bytes, $transformer_sha) = @ARGV;
    $workspace_root = validate_workspace_root($workspace_root);
    ($future_bytes, $future_sha) = validate_identity_argument($future_bytes, $future_sha);
    ($transformer_bytes, $transformer_sha) = validate_identity_argument($transformer_bytes, $transformer_sha);

    my $source_path = construct_contained_path($workspace_root, $SOURCE_REL);
    my $target_path = construct_contained_path($workspace_root, $TARGET_REL);
    stop_now(11) if $source_path eq $target_path;

    my $raw = read_whole_regular_nofollow($source_path);
    my @target_stat = lstat($target_path);
    if (@target_stat) {
        stop_now(12);
    }
    my $target_errno = 0 + $!;
    stop_now(12) unless $target_errno == ENOENT;
    stop_now(13) unless length($raw) == $EXPECTED_SOURCE_RAW_BYTES;
    stop_now(14) unless sha256_hex($raw) eq $EXPECTED_SOURCE_RAW_SHA256;
    stop_now(15) unless substr($raw, -1, 1) eq "\n";
    stop_now(16) unless literal_count($raw, "\n") == 1;
    stop_now(17) if index($raw, "\r") >= 0;

    my $vector = substr($raw, 0, -1);
    stop_now(18) unless length($vector) == $EXPECTED_SOURCE_VECTOR_BYTES;
    stop_now(19) unless sha256_hex($vector) eq $EXPECTED_SOURCE_VECTOR_SHA256;
    stop_now(20) unless $vector =~ /\A[\x20-\x7E]+\z/;
    stop_now(21) unless literal_count($vector, $TECHNICAL_SUFFIX_ANCHOR) == 1;

    my $anchor_offset = index($vector, $TECHNICAL_SUFFIX_ANCHOR);
    stop_now(22) unless $anchor_offset == $EXPECTED_SOURCE_PREFIX_BYTES;
    my $prefix = substr($vector, 0, $anchor_offset);
    my $suffix = substr($vector, $anchor_offset);
    stop_now(23) unless length($suffix) == $EXPECTED_TECHNICAL_SUFFIX_BYTES;
    stop_now(24) unless sha256_hex($suffix) eq $EXPECTED_TECHNICAL_SUFFIX_SHA256;
    stop_now(25) unless index($prefix, $HEADER_CONTEXT) == 0;
    stop_now(26) unless substr($prefix, -1, 1) eq '_';

    $prefix = replace_literal_exact1($prefix, $OLD_HEADER_MARKER, $NEW_HEADER_MARKER);
    $prefix = replace_literal_exact1($prefix, $OLD_CURRENT_CARRIER_PATH, $NEW_CURRENT_CARRIER_PATH);
    my $lineage = build_lineage_bundle($future_bytes, $future_sha, $transformer_bytes, $transformer_sha);
    my $target_vector = $prefix . $lineage . $suffix;
    validate_target_vector($target_vector, $suffix);

    my $patch =
        "*** Begin Patch\n" .
        '*** Add File: ' . $TARGET_REL . "\n" .
        '+' . $target_vector . "\n" .
        "*** End Patch\n";
    validate_patch_payload($patch, $target_vector, $workspace_root);
    write_stdout_whole($patch);
}

$SIG{__WARN__} = sub { };
main();
exit(0);
