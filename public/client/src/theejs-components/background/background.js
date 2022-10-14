export default function Background(props) {
    // This reference will give us direct access to the mesh
    return (
        <mesh {...props} >
            <planeBufferGeometry attach="geometry" args={[props.gameAspect[0], props.gameAspect[1]]} />
            <meshBasicMaterial attach="material" color={'black'} />
        </mesh>
    )
}
