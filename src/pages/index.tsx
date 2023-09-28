import { useDeep, useDeepSubscription, useDeepId } from '@deep-foundation/deeplinks/imports/client';
import { useContext, useEffect, useRef, useState } from 'react';

import { useListenLink, useSendLink } from '../utils/connectPeer'
import { PeerContext } from '../components/ProviderPeer';
import { Link } from '@deep-foundation/deeplinks/imports/minilinks';

export default function Home() {
  const deep = useDeep();
  const [link1488, setLink1488] = useState<Link<number>>();
  // useListenLink(1488);
  // useSendLink(1488);

  console.log("find admin", deep.minilinks.byId[380])


  return (
    <div>
      <button onClick={()=>{}}>add</button>
      <div>
        {link1488?.id}
      </div>
    </div>
  )
}
