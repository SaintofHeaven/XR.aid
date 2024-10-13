import { PinchButton } from "SpectaclesInteractionKit/Components/UI/PinchButton/PinchButton";

@component
export class StartButton extends BaseScriptComponent {
    @input chestMesh: RenderMeshVisual
    @input audioPlayer: AudioComponent

    private isGreen: boolean = true;
    private delayEvent: DelayedCallbackEvent
    private pinchButton: PinchButton

    onAwake() {
        this.delayEvent = this.createEvent("DelayedCallbackEvent")
        this.delayEvent.enabled = false
        this.delayEvent.bind(() => {

            this.toggleColorAndAudio()
            this.delayEvent.reset(0.25)
        })

        this.pinchButton = this.sceneObject.getComponent(PinchButton.getTypeName())
        this.pinchButton.onButtonPinched.add(() => {
            this.toggleInterval()
        })
    }

    toggleInterval() {
        let oldTime = getTime()

        if (getTime() - oldTime < 0.25) {
            if (!this.delayEvent.enabled) {
                this.delayEvent.enabled = true
                this.chestMesh.sceneObject.getParent().enabled = true
                this.delayEvent.reset(0.25)
                this.audioPlayer.play(-1)
            } else {
                this.delayEvent.enabled = false
                this.chestMesh.sceneObject.getParent().enabled = false
                this.audioPlayer.stop(true)
            }
        } else {
            this.delayEvent.enabled = false
            this.audioPlayer.stop(true)
        }
    }

    toggleColorAndAudio() {
        const pass = this.chestMesh.mainMaterial.mainPass;
        print(this.chestMesh.mainMaterial.name)
        if (this.isGreen) {
            pass.baseColor = new vec4(1, 0, 0, 1); // Set to red
        } else {
            pass.baseColor = new vec4(0, 1, 0, 1); // Set to green
        }
        this.isGreen = !this.isGreen;
    }
}