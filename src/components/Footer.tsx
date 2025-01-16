import { useState } from 'react';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import Link from '@mui/joy/Link';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';

type DisclaimerModalProps = {
  open: boolean;
  onClose: () => void;
};

function DisclaimerModal({ open, onClose }: DisclaimerModalProps) {
  const contents = [
    [
      '掲載内容について',
      '本サイト記載されている情報は、その内容の正確性・妥当性、利用目的への適合性、\
      安全性、信頼性などについて保証しません。\
      人名用漢字など、可能な限り正しい情報を掲載するよう努めていますが、正しくない可能性があります。\
      記載情報の誤り、および記載情報に基づいて行われたことによって生じた直接的、また間接的トラブル、\
      損失、損害については、本サイトは一切の責任を負いません。'
    ],
    [
      '損害等の責任について',
      '本サイトに掲載された内容・機能・その他全てのコンテンツによって生じた損害等の一切の責任を\
      本サイトは負いません。\
      また本サイトからリンクやバナーなどによって他のサイトに移動された場合、\
      移動先サイトで提供される情報、サービス等について一切の責任も本サイトは負いません。\
      本サイトの不具合、保守、火災、停電、その他の自然災害、ウィルスや第三者の妨害等行為による不可抗力などによって、\
      本サイトが提供する機能・サービスが停止したことに起因して利用者に生じた損害についても、\
      本サイトは責任を負いません。\
      利用者が、本サイトの利用によって第三者へ何らかの損害を与えた場合にも、本サイトは責任を負いません。\
      本サイトの利用は、利用者の自己責任で行う必要があります。'
    ],
    [
      '提供サービスの保証・停止について',
      '本サイトは、セキュリティなどに関する欠陥、エラー、バグ、不具合などがないことを保証しません。\
      また本サイトは、利用者に事前に通知することなく、本サイトが提供するサービスの全部または一部の提供を\
      停止または中断することができるものとします。\
      これらによって利用者に生じた損害について一切の責任を負いません。'
    ],
    [
      '提供サービス内容の変更',
      '本サイトが提供するサービスは、利用者に通知することなく内容変更、提供中止をすることができるものとし、\
      これによって利用者に生じた損害について一切の責任を負いません。'
    ],
    [
      '引用・リンクについて',
      '本サイトはリンクフリーです。引用も構いません。'
    ],
  ];

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Sheet
        variant="plain"
        sx={{
          height: '80%',
          overflowY: 'auto',
          maxWidth: '75%',
          width: '1000px',
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
        }}
      >
        <ModalClose variant="plain" onClick={onClose} />
        <Typography level="h2" mb={1}>
          免責事項
        </Typography>
        <Typography mb={3} sx={{ wordBreak: 'break-all' }}>
          本サイトにおける免責事項は以下の通りです。本サイトを利用する場合は、以下に従っていただくものとします。
        </Typography>
        {
          contents.map((e) => {
            return (
              <div>
                <Typography level="h3" mb={1}>{`・${e[0]}`}</Typography>
                <Typography mb={3} sx={{ wordBreak: 'break-all' }}>{e[1]}</Typography>
              </div>
            );
          })}
      </Sheet>
    </Modal>
  );
}


type FooterProp = {
  footerPaddingPx: number;
  footerHeightPx: number;
}

function Footer({
  footerPaddingPx,
  footerHeightPx,
}: FooterProp) {

  const [open, setOpen] = useState<boolean>(false);

  return (
    <Box
      sx={{
        flexShrink: 0,
        // borderTop: '1px solid var(--joy-palette-divider)',
        backgroundColor: 'var(--joy-palette-background-surface)',
        textAlign: 'center',
        padding: `${footerPaddingPx}px 0`,
        // position: 'fixed',
        // bottom: 0,
        width: '100%',
        height: `${footerHeightPx}px`,
      }}
    >
      <Typography level="body-md" sx={{ alignItems: 'center' }}>
        © 2025- mu-777.{'　'}|{'　'}
        <Link level="body-md" underline="hover" textColor="text.secondary" color="neutral"
          onClick={() => setOpen(true)}>
          免責事項
        </Link>
      </Typography>
      <DisclaimerModal open={open} onClose={() => setOpen(false)} />
    </Box>
  )
}

export default Footer;