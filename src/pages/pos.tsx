import { useDeep, useDeepSubscription, useDeepId } from '@deep-foundation/deeplinks/imports/client';
import { useContext, useEffect, useRef, useState } from 'react';

import { useListenLink, useSendLink } from '../utils/connectPeer'
import { PeerContext } from '../components/ProviderPeer';
import { Link } from '@deep-foundation/deeplinks/imports/minilinks';

export default function Home() {
    const deep = useDeep();
    const [link1488, setLink1488] = useState<Link<number>>();
    const [x, setX] = useState(0);
    // useListenLink(1488);
    useSendLink(1488);

    console.log("find admin", deep.minilinks.byId[1488])


    const updateLink = async () => {
        console.log((await deep.select({ id: 1488 })).data)

        deep.minilinks.apply((await deep.select({ id: 1488 })).data, "admin")
        console.log(deep.minilinks.byId[1488])
    }
    useEffect(() => {
        const addedEvent = (oldLink: Link<number>, newLink: Link<number>) => {
            if (newLink.id !== 1488) return;
            console.log("added", newLink)
            setLink1488(newLink);
        }
        const updatedEvent = (oldLink: Link<number>, newLink: Link<number>) => {
            if (newLink.id !== 1488) return;
            console.log("updated", newLink)
            setLink1488(newLink);
        }
        deep.minilinks.emitter.on('added', addedEvent);
        deep.minilinks.emitter.on('updated', updatedEvent);
        return () => {
            deep.minilinks.emitter.removeListener('added', addedEvent);
            deep.minilinks.emitter.removeListener('updated', updatedEvent);
        }
    }, [])

    const hoverBlock = (e: any) => {
        console.log(e.movementX);
        console.log(deep.minilinks.byId[1488])
        if (deep.minilinks.byId[1488]?.value?.value) {
            deep.minilinks.byId[1488].value.value += e.movementX
        }
    }

    return (
        <div>
            <button onClick={updateLink}>add</button>
            <div style={{ width: 100, height: 100, background: 'blue' }} onMouseMove={hoverBlock}>
                {deep.minilinks.byId[1488]?.value?.value}
            </div>
        </div>
    )
}
