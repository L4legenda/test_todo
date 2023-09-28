import { useDeep } from '@deep-foundation/deeplinks/imports/client';
import { createContext, useContext, useEffect, useState } from "react"

let Peer: any;
if (typeof window !== 'undefined') {
    Peer = require('peerjs').Peer;
}



export const PeerContext = createContext<{ peer: any, peerLinkId: number }>({ peer: null, peerLinkId: 0 });

export const ProviderPeer = ({ children }: { children: any }) => {
    const [peerContext, setPeerContext] = useState({ peer: null, peerLinkId: 0 })
    const deep = useDeep();
    useEffect(() => {
        const peer = new Peer({
            host: "5052-deepfoundation-dev-8ag60pw1phb.ws-eu104.gitpod.io",
            path: '/peerjs',
            secure: true,
        })
        peer.on('open', function (id: string) {
            console.log('My peer ID is:'+ id);
        });

        const fn = async function () {
            const peerLinkTypeId = await deep.id("@l4legenda/peer-webrtc", "Peer");

            const peerId: string = peer.id

            const { data: [{ id: peerLinkId }] } = await deep.insert({
                type_id: peerLinkTypeId,
                string: { data: { value: peerId } }
            })

            setPeerContext({
                peer: peer,
                peerLinkId: peerLinkId,
            })
        }
        fn();
    }, [])
    return <PeerContext.Provider value={peerContext}>{children}</PeerContext.Provider>
}