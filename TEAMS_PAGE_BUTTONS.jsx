// ============================================
// TEAMS PAGE - ADD THESE BUTTONS
// ============================================
// Replace the Actions section (around line 419-439) in TeamsPage.jsx

{/* Actions */ }
<Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
    {/* Manage Members Button */}
    <Button
        size="small"
        variant="outlined"
        startIcon={<ManageAccounts />}
        onClick={() => navigate(`/teams/${team.team_id}/manage`)}
        sx={{
            flex: 1,
            textTransform: 'none',
            fontWeight: 600,
            py: 1,
            borderWidth: 2,
            borderColor: '#667eea',
            color: '#667eea',
            '&:hover': {
                borderWidth: 2,
                borderColor: '#764ba2',
                bgcolor: 'rgba(102, 126, 234, 0.05)',
            },
        }}
    >
        Manage
    </Button>

    {/* Edit Button */}
    <Button
        size="small"
        variant="outlined"
        onClick={() => navigate(`/teams/${team.team_id}/edit`)}
        sx={{
            minWidth: 'auto',
            px: 2,
            py: 1,
            borderWidth: 2,
            borderColor: '#10b981',
            color: '#10b981',
            '&:hover': {
                borderWidth: 2,
                borderColor: '#059669',
                bgcolor: 'rgba(16, 185, 129, 0.05)',
            },
        }}
    >
        Edit
    </Button>

    {/* Delete Button */}
    <Button
        size="small"
        variant="outlined"
        onClick={async () => {
            if (window.confirm(`Are you sure you want to delete "${team.team_name}"? This will also remove all team members.`)) {
                try {
                    await api.post('/api/teams/delete.php', { team_id: team.team_id });
                    fetchTeams(); // Refresh the teams list
                } catch (error) {
                    alert('Failed to delete team. Please try again.');
                }
            }
        }}
        sx={{
            minWidth: 'auto',
            px: 2,
            py: 1,
            borderWidth: 2,
            borderColor: '#ef4444',
            color: '#ef4444',
            '&:hover': {
                borderWidth: 2,
                borderColor: '#dc2626',
                bgcolor: 'rgba(239, 68, 68, 0.05)',
            },
        }}
    >
        Delete
    </Button>
</Box>
