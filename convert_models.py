import bpy
import sys
import os

# Function to get script arguments
def get_arg(arg_name):
    try:
        return sys.argv[sys.argv.index(arg_name) + 1]
    except ValueError:
        return None

input_path = get_arg("--input_path")
output_path = get_arg("--output_path")

if not input_path or not output_path:
    print("Error: --input_path and --output_path must be provided.")
    bpy.ops.wm.quit_blender()
    sys.exit(1)

# Clear existing objects
bpy.ops.wm.read_factory_settings(use_empty = True)

# Import model
file_ext = os.path.splitext(input_path)[1].lower()

if file_ext == ".fbx":
    bpy.ops.import_scene.fbx(filepath=input_path)
elif file_ext == ".obj":
    bpy.ops.import_scene.obj(filepath=input_path)
else:
    print(f"Error: Unsupported input file format: {file_ext}")
    bpy.ops.wm.quit_blender()
    sys.exit(1)

# Export as glTF (binary .glb)
try:
    bpy.ops.export_scene.gltf(filepath=output_path, export_format='GLB', export_apply=True)
    print(f"Successfully converted {input_path} to {output_path}")
except Exception as e:
    print(f"Error during glTF export: {e}")
    bpy.ops.wm.quit_blender()
    sys.exit(1)

bpy.ops.wm.quit_blender()

