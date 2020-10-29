import React from 'react'
import _ from 'lodash'
import {
  Box,
  TextField,
  Typography
} from '@material-ui/core'
import { useDispatch } from 'react-redux'

import { updateCard } from 'src/slices/kanbanBoard'
import { CardInterface } from '../../../types/kanbanEntities'

interface DetailsProps {
  card: CardInterface
}

const Details: React.FC<DetailsProps> = ({ card}) => {
  const dispatch = useDispatch();

  const handleUpdate = _.debounce(async (update: Object) => {
    try {
      await dispatch(updateCard(card.id, update))

    } catch (err) {
      console.error(err)
    }
  }, 1000)

  return (
    <div>
      <Box mt={3}>
        <TextField
          variant="outlined"
          fullWidth
          defaultValue={ card.title }
          onChange={ (event) => handleUpdate({ title: event.target.value })}
          label="Title"
        />
      </Box>
      <Box mt={3}>
        <Typography
          variant="h5"
          color="textPrimary"
        >
          Details
        </Typography>
        <Box mt={2}>
          <TextField
            multiline
            rows={6}
            fullWidth
            variant="outlined"
            onChange={(event) => handleUpdate({ body: event.target.value })}
            placeholder="Describe the issue"
            defaultValue={ card.body }
          />
        </Box>
      </Box>
    </div>
  )
}

export default Details
