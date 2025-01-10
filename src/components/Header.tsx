import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';

function Header() {
  return (
    <Box sx={{
      padding: '16px'
      // backgroundColor: 'var(--joy-palette-header-bg)'
       }}>
      <Box textAlign="center">
        <Typography level="h1" mb={1}>
          人名漢字 全組合せくん
        </Typography>
        <Typography level="body-md" color="neutral">
          善し悪し・存在するしないに関わらず、指定の条件での全ての人名漢字の組み合わせを表示します。
        </Typography>
      </Box>
    </Box>
  );
}

export default Header;
