import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
// import XIcon from '@mui/icons-material/X';
// import InstagramIcon from '@mui/icons-material/Instagram';
// import IconButton from '@mui/joy/IconButton';
// import Stack from '@mui/joy/Stack';

function Header() {
  return (
    <Box sx={{
      padding: '16px'
      // backgroundColor: 'var(--joy-palette-header-bg)'
    }}>
      <Box textAlign="center">
        <Typography level="h1" mb={1}>
          人名漢字∞組み合わせ
        </Typography>
        <Typography level="body-md" color="neutral" sx={{ alignItems: 'center' }}>
          善し悪し・存在するしないに関わらず、指定の条件での全ての人名漢字の組み合わせを表示します。
        </Typography>
        {/* <Stack direction="row" spacing={1} justifyContent="center">
        <IconButton >
          <InstagramIcon fontSize='small' />
        </IconButton>
        <IconButton >
          <XIcon fontSize='small' />
        </IconButton>
        </Stack> */}
      </Box>
    </Box>
  );
}

export default Header;
