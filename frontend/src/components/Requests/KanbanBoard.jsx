import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Chip, Tooltip } from '@mui/material';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { STAGE_COLORS } from '../../utils/constants';
import { updateRequestStage } from '../../services/requestService';
import { Assignment, Person } from '@mui/icons-material';

const KanbanColumn = ({ id, title, items, color, onRequestClick }) => {
  return (
    <Box
      sx={{
        minWidth: 320,
        backgroundColor: '#f8f9fa',
        borderRadius: 2,
        p: 2,
        border: `2px solid ${color}20`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ color, fontWeight: 600 }}>
          {title}
        </Typography>
        <Chip label={items.length} size="small" sx={{ bgcolor: `${color}20`, color }} />
      </Box>
      <SortableContext items={items.map((item) => item.request_id)} strategy={verticalListSortingStrategy}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {items.map((item) => (
            <RequestCard key={item.request_id} request={item} onRequestClick={onRequestClick} />
          ))}
          {items.length === 0 && (
            <Box
              sx={{
                p: 3,
                textAlign: 'center',
                color: 'text.secondary',
                border: '2px dashed #ddd',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">No requests</Typography>
            </Box>
          )}
        </Box>
      </SortableContext>
    </Box>
  );
};

const RequestCard = ({ request, onRequestClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: request.request_id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    urgent: 'error',
    high: 'warning',
    medium: 'info',
    low: 'default',
  };

  const handleCardClick = (e) => {
    // Don't trigger click when dragging
    if (!isDragging && onRequestClick) {
      onRequestClick(request);
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
      sx={{
        mb: 2,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        borderLeft: request.is_overdue ? '4px solid #ef4444' : `4px solid ${STAGE_COLORS[request.stage_name] || '#2563eb'}`,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        '&:hover': {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {request.is_overdue && (
          <Chip label="OVERDUE" color="error" size="small" sx={{ mb: 1, fontWeight: 600 }} />
        )}
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
          {request.subject}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {request.equipment_name || 'No equipment'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          {request.assigned_to_name && (
            <Tooltip title={request.assigned_to_name}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: 'primary.main',
                  fontSize: '0.75rem',
                }}
              >
                {request.assigned_to_name.charAt(0)}
              </Avatar>
            </Tooltip>
          )}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Chip
              label={request.request_type}
              size="small"
              color={request.request_type === 'Preventive' ? 'info' : 'default'}
              variant="outlined"
            />
            <Chip
              label={request.priority}
              size="small"
              color={priorityColors[request.priority] || 'default'}
            />
          </Box>
        </Box>

        {request.scheduled_date && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            📅 {new Date(request.scheduled_date).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const KanbanBoard = ({ requests, onUpdate, onRequestClick }) => {
  const [activeId, setActiveId] = useState(null);
  const [stages, setStages] = useState(['New', 'In Progress', 'Repaired', 'Scrap']);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getRequestsByStage = (stageName) => {
    return requests.filter((req) => req.stage_name === stageName);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeRequest = requests.find((r) => r.request_id === active.id);
    const overStage = over.id.toString();

    if (activeRequest.stage_name === overStage) return;

    // Find stage_id for the target stage
    // TODO: Fetch from API or use context
    const stageIdMap = {
      'New': 1,
      'In Progress': 2,
      'Repaired': 3,
      'Scrap': 4,
    };

    try {
      await updateRequestStage(active.id, stageIdMap[overStage]);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating stage:', error);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 2,
          px: 1,
          minHeight: '600px',
        }}
      >
        {stages.map((stage) => (
          <KanbanColumn
            key={stage}
            id={stage}
            title={stage}
            items={getRequestsByStage(stage)}
            color={STAGE_COLORS[stage]}
            onRequestClick={onRequestClick}
          />
        ))}
      </Box>
      <DragOverlay>
        {activeId ? (
          <Card sx={{ width: 320, boxShadow: 8 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {requests.find((r) => r.request_id === activeId)?.subject}
              </Typography>
            </CardContent>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
