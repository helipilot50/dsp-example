import { AccountFee } from 'not-dsp-graphql';
import { Box, Card, CardContent, CardHeader, FormControl, Stack, TextField, Typography } from '@mui/material';

export interface AccountFeesProps {
  fee: AccountFee;
  disabled?: boolean;
}

export function AccountFees({ fee, disabled }: AccountFeesProps) {
  return (
    <Stack direction='row' sx={{ mt: 1 }}>
      <TextField sx={{ width: '33%' }}
        required
        id="demandSideFee"
        name="demandSideFee"
        label="Demand Side Fee"
        fullWidth
        autoComplete="demandSideFee"
        value={fee.demandSideFee || 0}
        type='number'
        variant='outlined'
        disabled={disabled}
        size='small'
      />
      <TextField sx={{ width: '33%', ml: 1 }}
        id="supplySideFee"
        name="supplySideFee"
        label="Supply Side Fee"
        fullWidth
        value={fee?.supplySideFee || 0}
        type='number'
        variant='outlined'
        disabled={disabled}
        size='small'
      />
      <TextField sx={{ width: '33%', ml: 1 }}
        required
        id="accountServicingFee"
        name="accountServicingFee"
        label="Account Service Fee"
        fullWidth
        autoComplete="accountServicingFee"
        value={fee?.accountServicingFee || 0}
        type='number'
        variant='outlined'
        disabled={disabled}
        size='small'
      />
    </Stack>
  );
}
