import { AccountFee } from 'not-dsp-graphql';
import { Box, TextField, Typography } from '@mui/material';

export interface AccountFeesProps {
  fee?: AccountFee | undefined;
  disabled?: boolean;
}

export function AccountFees(props: AccountFeesProps) {
  return (
    <Box
      sx={{
        width: 200,
        height: 200,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Fees
      </Typography>
      <TextField
        required
        id="demandSideFee"
        name="demandSideFee"
        label="Demand Side Fee"
        // fullWidth
        autoComplete="demandSideFee"
        value={props.fee?.demandSideFee || 0}
        type='number'
        variant='outlined'
        disabled={props.disabled}
      />
      <TextField
        id="supplySideFee"
        name="supplySideFee"
        label="Supply Side Fee"
        // fullWidth
        value={props.fee?.supplySideFee || 0}
        type='number'
        variant='outlined'
        disabled={props.disabled}
      />
      <TextField
        required
        id="accountServicingFee"
        name="accountServicingFee"
        label="Account Service Fee"
        // fullWidth
        autoComplete="accountServicingFee"
        value={props.fee?.accountServicingFee || 0}
        type='number'
        variant='outlined'
        disabled={props.disabled}
      />
    </Box>
  );
}
