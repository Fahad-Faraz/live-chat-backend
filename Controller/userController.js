import User from "../Models/User.js";
import bcrypt from "bcryptjs"; // ✅ FIX: was missing

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user.id },
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.avatar = req.file.path;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try { // ✅ FIX: was missing try/catch
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) {
      return res.status(400).json({ message: "Wrong Password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password Updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutAll = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.tokenVersion++;
    await user.save();

    res.json({ success: true, message: "Logged out from all devices" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { userId } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { blockedUsers: userId },
    });

    res.json({ message: "User blocked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { blockedUsers: userId },
    });

    res.json({ message: "User unblocked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};