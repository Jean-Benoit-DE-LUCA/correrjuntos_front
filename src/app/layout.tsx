import Container from "./container";

// ROOT LAYOUT //

export default function RootLayout({ children, }: {children: React.ReactNode}) {

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans+Caption&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&display=swap" rel="stylesheet"></link>
      </head>
      
          <body>
            <Container>
              {children}
            </Container>
          </body>
        
    </html>
  );
}

