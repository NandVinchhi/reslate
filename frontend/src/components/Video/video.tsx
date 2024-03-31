// "use client";
// // import { Peer } from "peerjs";
// import "regenerator-runtime/runtime";
// import Peer from "peerjs";
// import { useEffect, useRef, useState } from "react";

// export default function VideoComponent(): JSX.Element {
//   const [peerId, setPeerId] = useState<string>("");
//   const [remotePeerIDValue, setRemotePeerIDValue] = useState<string>("");
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);
//   const currentUserVideoRef = useRef<HTMLVideoElement>(null);
//   const peerInstance = useRef<Peer | null>(null);

//   useEffect(() => {
//     const peer = new Peer();
//     peer.on("open", (id) => {
//       setPeerId(id);
//     });

//     peer.on("call", (call) => {
//       navigator.mediaDevices
//         .getUserMedia({ video: true, audio: true })
//         .then((stream) => {
//           if (currentUserVideoRef.current) {
//             currentUserVideoRef.current.srcObject = stream;
//             currentUserVideoRef.current.play();
//           }
//           call.answer(stream);
//           call.on("stream", function (stream: any) {
//             if (remoteVideoRef.current) {
//               remoteVideoRef.current.srcObject = stream;
//               remoteVideoRef.current.play();
//             }
//           });
//         })
//         .catch((err) => {
//           console.log("Failed to send local stream", err);
//         });
//     });

//     peerInstance.current = peer;
//   }, []);

//   function call(otherPeerID: string) {
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         if (currentUserVideoRef.current) {
//           currentUserVideoRef.current.srcObject = stream;
//           currentUserVideoRef.current.play();
//         }
//         if (peerInstance.current) {
//           const call = peerInstance.current.call(otherPeerID, stream);
//           call.on("stream", function (stream: any) {
//             if (remoteVideoRef.current) {
//               remoteVideoRef.current.srcObject = stream;
//               remoteVideoRef.current.play();
//             }
//           });
//         }
//       })
//       .catch((err) => {
//         console.log("Failed to get local stream", err);
//       });
//   }

//   return (
//     <div>
//       <h1>
//         Meeting link: {"http://localhost:3000/video?peerId=" + peerId}
//       </h1>
//       <input
//         type="text"
//         value={remotePeerIDValue}
//         onChange={(e) => setRemotePeerIDValue(e.target.value)}
//       />
//       <button onClick={() => call(remotePeerIDValue)}>Call</button>
//       <div>
//         <video ref={currentUserVideoRef} />
//       </div>
//       <div>
//         <video ref={remoteVideoRef} />
//       </div>
//     </div>
//   );
// }
